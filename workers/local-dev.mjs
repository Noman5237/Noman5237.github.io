/**
 * Local dev proxy — mirrors the Cloudflare Worker logic using Node.js built-in fetch.
 * Run: node local-dev.mjs
 * Requires GROQ_API_KEY in environment (set in .dev.vars or export it).
 */
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { SYSTEM_PROMPT } from './src/prompt.js';

// Load .dev.vars into process.env
const dir = dirname(fileURLToPath(import.meta.url));
try {
  const vars = readFileSync(join(dir, '.dev.vars'), 'utf8');
  for (const line of vars.split('\n')) {
    const eq = line.indexOf('=');
    if (eq > 0) process.env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
} catch {}

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PORT = 8788;
const ALLOWED_ORIGIN = 'http://localhost:3333';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const server = createServer(async (req, res) => {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let messages;
  try {
    ({ messages } = JSON.parse(body));
    if (!Array.isArray(messages)) throw new Error();
  } catch {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  // ── Input classification ──
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  let isTask = false;
  try {
    const classRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'Classify the user message as "task" (they want code, scripts, configs, YAML, queries, or any technical artifact written for their own use) or "about" (they are asking about a specific person\'s professional background, experience, skills, or projects). Respond with JSON only, no explanation: {"type":"task"} or {"type":"about"}' },
          { role: 'user', content: lastUserMsg },
        ],
        stream: false,
        max_tokens: 12,
        temperature: 0,
      }),
    });
    console.log(`[classifier] status=${classRes.status}`);
    const classData = await classRes.json();
    const classText = classData.choices?.[0]?.message?.content?.trim() || '{}';
    isTask = JSON.parse(classText).type === 'task';
  } catch (e) { console.log(`[classifier] error: ${e.message}`); }

  if (isTask) {
    const refusal = "Oh nice, so now this is a coding service? I must have missed the memo. I'm here to talk about my work — not write yours. Ask me something about my actual experience instead.";
    res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: refusal } }] })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
    return;
  }

  const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  console.log(`[upstream] status=${upstream.status}`);
  if (!upstream.ok) {
    const errMsg = upstream.status === 429
      ? "Whoa, slow down — even I need a breather. Too many questions at once. Try again in a minute."
      : "Something went wrong on my end. Try again in a moment.";
    res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: errMsg } }] })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
    return;
  }

  res.writeHead(200, {
    ...CORS_HEADERS,
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  for await (const chunk of upstream.body) {
    res.write(chunk);
  }
  res.end();
});

server.listen(PORT, () => {
  console.log(`[local-dev] Chat proxy ready at http://localhost:${PORT}/chat`);
  console.log(`[local-dev] GROQ_API_KEY: ${GROQ_API_KEY ? '✓ set' : '✗ MISSING'}`);
});

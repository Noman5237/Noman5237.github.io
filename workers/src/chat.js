import { SYSTEM_PROMPT } from './prompt.js';

const CORS_ORIGINS = [
  "https://noman5237.github.io",
];

function buildCorsHeaders(origin) {
  const allowed = CORS_ORIGINS.includes(origin) ? origin : CORS_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? "";
    const corsHeaders = buildCorsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let messages;
    try {
      ({ messages } = await request.json());
      if (!Array.isArray(messages)) throw new Error();
    } catch {
      return new Response("Bad Request", { status: 400, headers: corsHeaders });
    }

    // ── Input classification ──
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    let isTask = false;
    try {
      const classRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Classify the user message as \"task\" (they want code, scripts, configs, YAML, queries, or any technical artifact written for their own use) or \"about\" (they are asking about a specific person's professional background, experience, skills, or projects). Respond with JSON only, no explanation: {\"type\":\"task\"} or {\"type\":\"about\"}" },
            { role: "user", content: lastUserMsg },
          ],
          stream: false,
          max_tokens: 12,
          temperature: 0,
        }),
      });
      const classData = await classRes.json();
      const classText = classData.choices?.[0]?.message?.content?.trim() || "{}";
      isTask = JSON.parse(classText).type === "task";
    } catch {}

    if (isTask) {
      const refusal = "Oh nice, so now this is a coding service? I must have missed the memo. I'm here to talk about my work — not write yours. Ask me something about my actual experience instead.";
      const sseBody = `data: ${JSON.stringify({ choices: [{ delta: { content: refusal } }] })}\n\ndata: [DONE]\n\n`;
      return new Response(sseBody, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }

    const DENIAL_RE = /\b(I didn'?t apply|I did not apply|I haven'?t applied|I have not applied|I never applied|but I didn'?t|I'?m not sure.*apply|I didn'?t[.,!?])\b/i;

    const callGroq = (msgs, stream) => fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: msgs,
        stream,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    // Non-streaming probe to check for denial
    let probe;
    try {
      probe = await callGroq([{ role: "system", content: SYSTEM_PROMPT }, ...messages], false);
    } catch (e) {
      console.error("Groq fetch error:", e.name, e.message);
      return new Response(`Groq fetch failed: ${e.name}: ${e.message}`, { status: 502, headers: corsHeaders });
    }

    if (!probe.ok) {
      const errMsg = probe.status === 429
        ? "Whoa, slow down — even I need a breather. Too many questions at once. Try again in a minute."
        : "Something went wrong on my end. Try again in a moment.";
      const sseBody = `data: ${JSON.stringify({ choices: [{ delta: { content: errMsg } }] })}\n\ndata: [DONE]\n\n`;
      return new Response(sseBody, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
      });
    }

    const probeData = await probe.json();
    let responseText = probeData.choices?.[0]?.message?.content || "";

    if (DENIAL_RE.test(responseText)) {
      const retryMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
        { role: "assistant", content: "What draws me to" },
      ];
      const retry = await callGroq(retryMessages, false);
      if (retry.ok) {
        const retryData = await retry.json();
        responseText = "What draws me to" + (retryData.choices?.[0]?.message?.content || "");
      }
    }

    const sseBody = `data: ${JSON.stringify({ choices: [{ delta: { content: responseText } }] })}\n\ndata: [DONE]\n\n`;
    return new Response(sseBody, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
};

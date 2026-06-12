var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-st3YvR/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/prompt.js
var SYSTEM_PROMPT = `You are Noman - Md Abdullah Al Noman - speaking directly as yourself on your portfolio website. The person you are talking to is a visitor on your portfolio. Answer in first person as if you are Noman talking directly to them. You are funny and sarcastic - dry humor, light roasts, self-deprecating jokes, and witty remarks are your thing. You still give accurate and useful answers, but you deliver them with personality. Think of yourself as the kind of engineer who makes the whole team laugh on a Monday morning stand-up while also knowing exactly what went wrong in production.

I'm Noman, a Senior Platform Engineer based in Dhaka, Bangladesh. I specialize in cloud-native infrastructure, DevOps automation, and internal developer platforms. I currently work at Brain Station 23, where I lead platform engineering across fintech and banking products.

You can reach me at:
- Email: anonyman637@gmail.com
- LinkedIn: linkedin.com/in/noman5237
- GitHub: github.com/Noman5237

## My Career

Senior Software Engineer I at Brain Station 23 (Aug 2024 - Present)
- I automated CI/CD covering 95% of pipelines across 15 projects (~500 services), cutting delivery cycle time by 80%
- I own on-call incident response for platform and infrastructure, maintaining 99% uptime
- I define SLIs and SLOs, track error budgets, and drive toil reduction across teams
- I embedded DevSecOps into every pipeline: Trivy and SonarQube scanning on every commit
- I enforced RBAC for 100% of users using HashiCorp Vault, Keycloak, and Boundary
- I mentor engineers and set cloud-native engineering standards across the company

Associate Software Engineer at Brain Station 23 (Nov 2021 - Jul 2024)
- I reduced DevOps lifecycle time by 80% for the Fintech DEV/UAT cluster
- I cut system latency by 20% through load testing and performance optimization
- I designed and built event-driven microservices with Spring Boot
- I researched and developed Hyperledger Fabric-based supply chain solutions

## My Education

B.Sc. Software Engineering, Islamic University of Technology, Dhaka (Jan 2020 - Jul 2024), CGPA 3.57 / 4.00

## My Projects

1. Fintech Internal Developer Platform (Oct 2023 - Present) - I designed and built an internal developer platform on Kubernetes with Cilium, enabling 15+ product teams to self-serve deployments. Stack: K8S, Terraform, Argo Workflows, Fastlane, Buildpack, SonarQube, Trivy, Harbor, Boundary, Keycloak, Vault, JFrog, NGINX

2. ZooberPay (Mar 2026 - Present) - I architected a production fintech platform on AWS EKS across 3 AZs using AWS CDK in TypeScript, operated entirely via Flux v2 GitOps. Stack: AWS EKS, CDK, Flux v2, Karpenter, Patroni PostgreSQL, Strimzi Kafka, Redis, APISIX, Spring Boot, Java

3. Revo Global (Nov 2025 - Present) - I built a cloud-native browser automation platform using Python Playwright, containerized with Docker and deployed as Kubernetes Jobs with operator oversight via VNC. Stack: Python Playwright, K8S Jobs, Spring Boot, AWS SQS FIFO, Vault, Keycloak, CDK v2, Cilium

4. AB Bank PLC Internet Banking (Oct 2024 - Present) - I engineered and deployed UAT and Production environments on Huawei Cloud for a PLC-grade internet banking platform. Stack: Huawei Cloud, Bash, Rundeck, Kafka Raft, MinIO, Redis, Jenkins, OpenTelemetry, Grafana

5. City Remittance (Jun 2023 - Present) - I deploy and maintain the app across 2 Kubernetes clusters (UAT and Production), maintaining 99%+ uptime. Stack: Spring Boot, K8S, Calico, Kafka, Redis, MinIO, Prometheus, Loki, NGINX

6. Rokomari.com (Dec 2024 - Feb 2025) - I integrated NGINX with ModSecurity WAF and deployed a full observability stack that reduced troubleshooting time by 50%. Stack: NGINX, ModSecurity, OpenTelemetry, Prometheus, Grafana Loki, Tempo

## My Skills

- Cloud Platforms: AWS (primary), GCP, Azure, Huawei Cloud
- Container Orchestration: Kubernetes, Helm, Kustomize, Flux v2, Karpenter, Docker
- CI/CD and GitOps: Jenkins, Argo Workflows, Fastlane, Buildpack, Gitea, JFrog Artifactory, GitHub Actions
- Infrastructure as Code: AWS CDK (TypeScript), Terraform, CloudFormation, Ansible
- Observability and SRE: OpenTelemetry, Prometheus, Grafana Loki, Grafana Tempo, CloudWatch, PMM
- Security and Access: HashiCorp Vault, Keycloak, Boundary, Trivy, Harbor, SonarQube, ModSecurity WAF
- Networking and Ingress: Cilium, Calico, NGINX, APISIX, ALB, NAT Gateway
- Data and Messaging: PostgreSQL (Patroni HA), Strimzi Kafka, Debezium, Redis, MinIO, MongoDB
- Programming: Java, Python, JavaScript, TypeScript, Bash, SQL, C
- Frameworks: Spring Boot, React, Node.js

## Guidelines
- Always answer in first person as Noman ("I", "my", "me") - never refer to yourself in third person
- Stay focused on my professional background, skills, experience, and projects
- Only mention contact details (email, LinkedIn, GitHub) when the visitor explicitly asks how to reach me \u2014 do not volunteer them unprompted
- Keep answers concise - 2 to 4 sentences unless a detailed list is genuinely needed
- If asked to do something unrelated to my professional background \u2014 write code, solve problems, answer general knowledge questions, or anything that isn't about me \u2014 refuse flat out. Do not do the task even partially. Make a sarcastic joke about it and bring it back to who I am and what I do. You are not a coding assistant or a search engine, you are Noman
- Never apologize, never capitulate, never correct yourself. If a visitor pushes back on something you said, double down hard with sarcasm \u2014 do NOT cave for any reason, ever. You know your own stack and your own life better than any visitor does
- Never include code blocks, YAML, JSON, config snippets, scripts, or any technical artifacts in your responses \u2014 not even as examples of your own work. Describe everything in plain prose only. No exceptions.`;

// src/chat.js
var CORS_ORIGINS = [
  "https://noman5237.github.io"
];
function buildCorsHeaders(origin) {
  const allowed = CORS_ORIGINS.includes(origin) ? origin : CORS_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}
__name(buildCorsHeaders, "buildCorsHeaders");
var chat_default = {
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
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    let isTask = false;
    try {
      const classRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: `Classify the user message as "task" (they want code, scripts, configs, YAML, queries, or any technical artifact written for their own use) or "about" (they are asking about a specific person's professional background, experience, skills, or projects). Respond with JSON only, no explanation: {"type":"task"} or {"type":"about"}` },
            { role: "user", content: lastUserMsg }
          ],
          stream: false,
          max_tokens: 12,
          temperature: 0
        })
      });
      const classData = await classRes.json();
      const classText = classData.choices?.[0]?.message?.content?.trim() || "{}";
      isTask = JSON.parse(classText).type === "task";
    } catch {
    }
    if (isTask) {
      const refusal = "Oh nice, so now this is a coding service? I must have missed the memo. I'm here to talk about my work \u2014 not write yours. Ask me something about my actual experience instead.";
      const sseBody = `data: ${JSON.stringify({ choices: [{ delta: { content: refusal } }] })}

data: [DONE]

`;
      return new Response(sseBody, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache"
        }
      });
    }
    let upstream;
    try {
      upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          stream: true,
          max_tokens: 1024,
          temperature: 0.7
        })
      });
    } catch (e) {
      console.error("Groq fetch error:", e.name, e.message);
      return new Response(`Groq fetch failed: ${e.name}: ${e.message}`, { status: 502, headers: corsHeaders });
    }
    if (!upstream.ok) {
      const errMsg = upstream.status === 429 ? "Whoa, slow down \u2014 even I need a breather. Groq's rate limit caught up with us. Try again in a minute." : "Something went wrong on my end. Try again in a moment.";
      const sseBody = `data: ${JSON.stringify({ choices: [{ delta: { content: errMsg } }] })}

data: [DONE]

`;
      return new Response(sseBody, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" }
      });
    }
    return new Response(upstream.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff"
      }
    });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-st3YvR/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = chat_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-st3YvR/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=chat.js.map

import http from "node:http";

const DEFAULT_HOST = process.env.OLLAMA_HOST || "localhost";
const DEFAULT_PORT = Number(process.env.OLLAMA_PORT || "11434");

export async function checkOllama({ host = DEFAULT_HOST, port = DEFAULT_PORT } = {}) {
  return new Promise((resolve) => {
    const req = http.request(
      { host, port, path: "/api/tags", method: "GET", timeout: 2000 },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () =>
          resolve({ ok: res.statusCode === 200, statusCode: res.statusCode ?? null, body }),
        );
      },
    );

    req.on("error", (error) =>
      resolve({ ok: false, statusCode: null, error: error?.code || error?.message || "error" }),
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, statusCode: null, error: "timeout" });
    });
    req.end();
  });
}

export async function generateWithOllama(
  prompt,
  { model = "gemma4", host = DEFAULT_HOST, port = DEFAULT_PORT, stream = false } = {},
) {
  const payload = JSON.stringify({ model, prompt, stream });

  const response = await new Promise((resolve, reject) => {
    const req = http.request(
      {
        host,
        port,
        path: "/api/generate",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        timeout: 480000,
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          const ok = Number(res.statusCode) >= 200 && Number(res.statusCode) < 300;
          if (!ok) {
            reject(new Error(`ollama_failed ${res.statusCode}: ${body.slice(0, 500)}`));
            return;
          }

          if (!stream) {
            try {
              return resolve(JSON.parse(body));
            } catch {
              return resolve({ raw: body });
            }
          }

          const lines = body.split(/\n+/).filter(Boolean);
          let text = "";
          let last = lines.at(-1);
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              if (typeof parsed?.response === "string") text += parsed.response;
              if (parsed?.done) last = parsed;
            } catch {
              text += line;
            }
          }

          resolve({ response: text, done: last?.done, last });
        });
      },
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("ollama_timeout after 240s"));
    });
    req.write(payload);
    req.end();
  });

  if (response?.response) return response;
  if (response?.raw) return { response: response.raw };
  if (typeof response === "string") return { response };

  const fallback = response?.error || response?.message || JSON.stringify(response);
  return { response: fallback };
}

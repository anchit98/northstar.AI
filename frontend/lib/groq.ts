import "server-only";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/** 128k+ context on Groq; better for full style samples + multi-day feeds (DEC-25). */
export const DEFAULT_GROQ_MODEL =
  process.env.GROQ_MODEL ?? "meta-llama/llama-4-scout-17b-16e-instruct";

/** Fallback if primary model errors (smaller context). */
export const FALLBACK_GROQ_MODEL = "llama-3.3-70b-versatile";

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function groqChat(
  messages: GroqMessage[],
  options?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in frontend/.env");
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options?.model ?? DEFAULT_GROQ_MODEL,
      messages,
      temperature: options?.temperature ?? 0.65,
      max_tokens: options?.maxTokens ?? 4096,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API ${res.status}: ${errText.slice(0, 500)}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned empty content");
  return content;
}

export function getGroqModelLabel(): string {
  return DEFAULT_GROQ_MODEL;
}

/** Try primary model, then fallback on context/token errors. */
export async function groqChatWithFallback(
  messages: GroqMessage[],
  options?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<{ content: string; model: string }> {
  const primary = options?.model ?? DEFAULT_GROQ_MODEL;
  try {
    const content = await groqChat(messages, { ...options, model: primary });
    return { content, model: primary };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const retriable =
      /413|429|context|token|too large|length|rate/i.test(msg) &&
      primary !== FALLBACK_GROQ_MODEL;
    if (!retriable) throw err;
    const content = await groqChat(messages, {
      ...options,
      model: FALLBACK_GROQ_MODEL,
      maxTokens: Math.min(options?.maxTokens ?? 4096, 3500),
    });
    return { content, model: FALLBACK_GROQ_MODEL };
  }
}

import "server-only";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const FALLBACK_GROQ_MODEL = "llama-3.3-70b-versatile";

const DEFAULT_MODEL_ID = "meta-llama/llama-4-scout-17b-16e-instruct";

/** Read at request time so Vercel env GROQ_MODEL is applied (not baked at build). */
export function getConfiguredGroqModel(): string {
  const fromEnv = process.env.GROQ_MODEL?.trim();
  return fromEnv || DEFAULT_MODEL_ID;
}

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

  const model = options?.model ?? getConfiguredGroqModel();

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
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
  return getConfiguredGroqModel();
}

function isRetriableGroqError(message: string): boolean {
  return /413|429|502|503|context|token|too large|length|rate|capacity/i.test(message);
}

/** Shrink user message feed/style sections before giving up on the primary model. */
function shrinkUserContent(content: string, ratio: number): string {
  const markers = [
    "--- feed items ---",
    "--- intel feed items ---",
    "--- linkedin_style.md",
    "--- personal_branding",
  ];
  let cutAt = content.length;
  for (const m of markers) {
    const idx = content.indexOf(m);
    if (idx >= 0) cutAt = Math.min(cutAt, idx);
  }
  const head = content.slice(0, cutAt);
  const tail = content.slice(cutAt);
  const tailBudget = Math.max(8_000, Math.floor(tail.length * ratio));
  const shrunkTail =
    tail.length > tailBudget
      ? `${tail.slice(0, tailBudget)}\n\n_[Context truncated — retry with smaller payload]_`
      : tail;
  return head + shrunkTail;
}

function shrinkMessages(messages: GroqMessage[], ratio: number): GroqMessage[] {
  return messages.map((m) =>
    m.role === "user" ? { ...m, content: shrinkUserContent(m.content, ratio) } : m
  );
}

/**
 * Prefer GROQ_MODEL from env. On context errors, shrink payload and retry primary
 * before falling back to llama-3.3-70b.
 */
export async function groqChatWithFallback(
  messages: GroqMessage[],
  options?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<{ content: string; model: string; retriedWithShrink?: boolean; usedFallbackModel?: boolean }> {
  const primary = options?.model ?? getConfiguredGroqModel();
  const maxTokens = options?.maxTokens ?? 4096;

  const attempts: { label: string; msgs: GroqMessage[]; model: string; maxTokens: number }[] = [
    { label: "primary", msgs: messages, model: primary, maxTokens },
    { label: "primary-shrink-60", msgs: shrinkMessages(messages, 0.6), model: primary, maxTokens },
    { label: "primary-shrink-45", msgs: shrinkMessages(messages, 0.45), model: primary, maxTokens },
  ];

  if (primary !== FALLBACK_GROQ_MODEL) {
    attempts.push({
      label: "fallback-70b",
      msgs: shrinkMessages(messages, 0.4),
      model: FALLBACK_GROQ_MODEL,
      maxTokens: Math.min(maxTokens, 3500),
    });
  }

  let lastError: Error | null = null;

  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    try {
      const content = await groqChat(attempt.msgs, {
        ...options,
        model: attempt.model,
        maxTokens: attempt.maxTokens,
      });
      return {
        content,
        model: attempt.model,
        retriedWithShrink: i > 0 && attempt.model === primary,
        usedFallbackModel: attempt.model === FALLBACK_GROQ_MODEL,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      lastError = error;
      const retriable = isRetriableGroqError(error.message);
      if (!retriable || i === attempts.length - 1) throw error;
    }
  }

  throw lastError ?? new Error("Groq request failed");
}

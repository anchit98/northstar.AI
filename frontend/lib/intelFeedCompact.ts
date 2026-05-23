/** Shrink RSS feed markdown for Groq context — keeps titles, metadata, short summaries. */

const ITEM_BODY_MAX = 420;

export function compactFeedMarkdown(markdown: string, maxChars: number): string {
  if (!markdown.trim()) return markdown;

  const blocks = markdown.split(/\n---\n/);
  const parts: string[] = [];
  let size = 0;

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const compact = compactItemBlock(trimmed);
    if (size + compact.length > maxChars && parts.length > 0) break;
    parts.push(compact);
    size += compact.length + 10;
  }

  let out = parts.join("\n\n---\n\n");
  if (out.length > maxChars) {
    out = `${out.slice(0, maxChars)}\n\n_[Feed context truncated for Groq context limit]_`;
  } else if (parts.length < blocks.filter((b) => b.trim()).length) {
    out += "\n\n_[Additional feed items omitted for context limit]_";
  }

  return out;
}

function compactItemBlock(block: string): string {
  const lines = block.split("\n");
  const out: string[] = [];
  let bodyLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("#### ") || line.startsWith("### ") || line.startsWith("## ")) {
      flushBody(out, bodyLines);
      bodyLines = [];
      out.push(line);
      continue;
    }
    if (line.match(/^- \*\*(Source|Published|Link):/)) {
      flushBody(out, bodyLines);
      bodyLines = [];
      out.push(line);
      continue;
    }
    if (line.startsWith("# Feed ")) {
      out.push(line);
      continue;
    }
    if (line.startsWith("> ") || line.startsWith("- ")) {
      out.push(line);
      continue;
    }
    bodyLines.push(line);
  }
  flushBody(out, bodyLines);
  return out.join("\n");
}

function flushBody(out: string[], bodyLines: string[]) {
  if (bodyLines.length === 0) return;
  const text = bodyLines.join("\n").trim();
  if (!text) return;
  if (text.length <= ITEM_BODY_MAX) {
    out.push(text);
    return;
  }
  out.push(`${text.slice(0, ITEM_BODY_MAX).trim()}…`);
}

/** Extract LinkedIn-ready post text (no Hook/Body/CTA labels) for copy & display. */

const LABELED_FIELDS =
  /- \*\*(Hook|Body|CTA|Hashtags|Sources cited|Suggested pillar):\*\*\s*/gi;

export function parseVariantBody(raw: string): {
  postText: string;
  pillar?: string;
} {
  const metaMatch = raw.match(/<!--\s*meta:\s*(pillar-[1-4])\s*-->/i);
  const pillar = metaMatch?.[1];

  let text = raw.replace(/<!--[\s\S]*?-->/g, "").trim();
  text = text.replace(/\n*_(?:Pillar|Theme):\s*[^\n]+_\s*$/i, "").trim();

  if (LABELED_FIELDS.test(text)) {
    text = labeledSectionsToPost(text);
  }

  return { postText: text.trim(), pillar };
}

function labeledSectionsToPost(text: string): string {
  const read = (label: string) => {
    const re = new RegExp(
      `- \\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n- \\*\\*|\\n<!--|$)`,
      "i"
    );
    return text.match(re)?.[1]?.trim() ?? "";
  };

  const hook = read("Hook");
  const body = read("Body");
  const cta = read("CTA");
  const hashtags = read("Hashtags");

  return [hook, body, cta, hashtags].filter(Boolean).join("\n\n");
}

export function splitPostVariants(content: string): { title: string; postText: string; pillar?: string }[] {
  const parts = content.split(/^## Variant /m).slice(1);
  if (parts.length === 0) {
    return [{ title: "Full document", postText: content.trim() }];
  }

  return parts.map((p) => {
    const nl = p.indexOf("\n");
    const title = nl === -1 ? p.trim() : p.slice(0, nl).trim();
    const rawBody = nl === -1 ? "" : p.slice(nl + 1);
    const { postText, pillar } = parseVariantBody(rawBody);
    return { title: `Variant ${title}`, postText, pillar };
  });
}

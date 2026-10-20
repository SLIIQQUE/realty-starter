/**
 * Minimal Lexical (Payload's richText editor) JSON -> plain-paragraph serializer.
 * Every mapper in this folder needs the same thing: turn a `richText` field's Lexical
 * document into the plain `string[]` (one entry per paragraph/list item) the site's
 * existing page templates already render. Deliberately simple: no bold/italic/link
 * formatting is preserved, since nothing currently rendered from static data needs it.
 */

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

function extractText(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  if (!node.children) return "";
  return node.children.map(extractText).join("");
}

export function lexicalToParagraphs(doc: unknown): string[] {
  const root = (doc as { root?: { children?: LexicalNode[] } } | null | undefined)?.root;
  if (!root?.children?.length) return [];

  const paragraphs: string[] = [];
  for (const node of root.children) {
    if (node.type === "list" && node.children?.length) {
      for (const item of node.children) {
        const text = extractText(item).trim();
        if (text) paragraphs.push(text);
      }
      continue;
    }
    const text = extractText(node).trim();
    if (text) paragraphs.push(text);
  }
  return paragraphs;
}

/**
 * Structured-data block. JSON-LD scripts are data, not executable code —
 * CSP script-src does not apply to them, and crawlers that execute
 * JavaScript (Google, Bing) read DOM-injected blocks.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes quotes/entities; </script> cannot occur
      // because '<' and '>' only appear inside JSON strings we control.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * Renders one or more schema.org objects as JSON-LD <script> tags.
 *
 * `<` is escaped to `\u003c` to prevent the JSON payload from breaking out of
 * the surrounding <script> element.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item).replace(/</g, "\\u003c")}
        </script>
      ))}
    </>
  );
}

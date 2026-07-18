// Renders one or more JSON-LD blocks. Keep schema generation in plain
// functions (schema.ts) and use this only to serialize — mirrors the
// pattern already used on askbiz.co (app/research/[slug]/page.tsx).
export default function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((block, i) => (
        // eslint-disable-next-line react/no-danger
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
    </>
  )
}

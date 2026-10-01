// A JSON value must never be able to terminate its containing HTML script tag.
export function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

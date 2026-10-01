type JsonRequestBodyResult =
  | {
      success: true
      data: unknown
    }
  | {
      success: false
      status: 400 | 413 | 415
      message: string
    }

const DEFAULT_MAX_JSON_BODY_BYTES = 64 * 1024

export async function readJsonRequestBody(
  request: Request,
  maxBytes = DEFAULT_MAX_JSON_BODY_BYTES,
): Promise<JsonRequestBodyResult> {
  const contentType = request.headers
    .get('content-type')
    ?.split(';')[0]
    ?.trim()
    .toLowerCase()

  if (contentType !== 'application/json') {
    return {
      success: false,
      status: 415,
      message: 'El cuerpo de la solicitud debe enviarse como application/json.',
    }
  }

  const textResult = await readLimitedRequestText(request, maxBytes)
  if (!textResult.success) return textResult

  try {
    const data = JSON.parse(textResult.text) as unknown
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { success: false, status: 400, message: 'La solicitud debe contener un objeto JSON.' }
    }
    return { success: true, data }
  } catch {
    return { success: false, status: 400, message: 'El cuerpo de la solicitud no contiene JSON válido.' }
  }
}

export async function readLimitedRequestText(request: Request, maxBytes: number): Promise<
  | { success: true; text: string }
  | { success: false; status: 400 | 413; message: string }
> {
  try {
    const tooLarge = () => ({
      success: false as const,
      status: 413 as const,
      message: 'La solicitud supera el tamaño permitido.',
    })
    const declaredSize = request.headers.get('content-length')
    if (declaredSize && Number(declaredSize) > maxBytes) {
      await request.body?.cancel()
      return tooLarge()
    }
    const reader = request.body?.getReader()
    if (!reader) throw new Error('EMPTY_BODY')
    const chunks: Uint8Array[] = []
    let size = 0
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > maxBytes) {
          await reader.cancel()
          return tooLarge()
        }
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
      bytes.set(chunk, offset)
      offset += chunk.byteLength
    }
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return { success: true, text }
  } catch {
    return {
      success: false,
      status: 400,
      message: 'No fue posible leer el cuerpo de la solicitud.',
    }
  }
}

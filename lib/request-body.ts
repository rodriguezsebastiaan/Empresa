type JsonRequestBodyResult =
  | {
      success: true
      data: unknown
    }
  | {
      success: false
      status: 400 | 415
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

  try {
    const text = await request.text()
    const size = new TextEncoder().encode(text).byteLength

    if (size > maxBytes) {
      return {
        success: false,
        status: 400,
        message: 'La solicitud supera el tamaÃ±o permitido.',
      }
    }

    const data = JSON.parse(text) as unknown

    return {
      success: true,
      data,
    }
  } catch {
    return {
      success: false,
      status: 400,
      message: 'El cuerpo de la solicitud no contiene JSON válido.',
    }
  }
}

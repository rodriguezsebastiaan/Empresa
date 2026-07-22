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

export async function readJsonRequestBody(
  request: Request,
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
    const data = await request.json()

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

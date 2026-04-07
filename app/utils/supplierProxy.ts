import { NextResponse } from 'next/server';

export const SUPPLIER_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
} as const;

export const SUPPLIER_AUTH_HEADER = {
  Authorization: 'Basic c3VwbGllcjpzdXBsaWVyQDIwMjU=',
} as const;

/**
 * Forward upstream JSON without throwing on 4xx/5xx (no Error stack in the terminal).
 * Preserves upstream HTTP status when the body is JSON or plain text.
 */
export async function forwardSupplierJsonResponse(
  upstream: Response,
  context: string,
): Promise<NextResponse> {
  const status = upstream.status;
  const text = await upstream.text();

  if (process.env.NODE_ENV === 'development' && !upstream.ok) {
    console.warn(
      `[supplier-api] ${context} upstream ${status}: ${text.slice(0, 280).replace(/\s+/g, ' ')}`,
    );
  }

  if (upstream.ok) {
    try {
      const data = text ? JSON.parse(text) : null;
      return NextResponse.json(data, { status: 200, headers: SUPPLIER_CORS_HEADERS });
    } catch {
      return NextResponse.json(
        { error: 'Upstream returned non-JSON', context, snippet: text.slice(0, 200) },
        { status: 502, headers: SUPPLIER_CORS_HEADERS },
      );
    }
  }

  try {
    const data = text ? JSON.parse(text) : { error: 'Empty upstream body' };
    return NextResponse.json(data, { status, headers: SUPPLIER_CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { error: context, upstreamStatus: status, message: text.slice(0, 500) },
      { status, headers: SUPPLIER_CORS_HEADERS },
    );
  }
}

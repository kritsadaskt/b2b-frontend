import { NextRequest, NextResponse } from 'next/server';
import { supplierApiUpstreamUrl } from '../../../utils/supplierUpstream';
import {
  forwardSupplierJsonResponse,
  SUPPLIER_AUTH_HEADER,
  SUPPLIER_CORS_HEADERS,
} from '../../../utils/supplierProxy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const contentType = request.headers.get('content-type') || '';
    const hasBody = body.trim().length > 0;
    const clientSentJson = contentType.includes('application/json');

    // Empty POST from browser often sends Content-Type: application/json with no body — many
    // ASP.NET endpoints reject that; use form encoding like other Suplier POSTs.
    const upstreamContentType =
      hasBody && clientSentJson ? 'application/json' : 'application/x-www-form-urlencoded';
    const upstreamBody = hasBody && clientSentJson ? body : '';

    const response = await fetch(supplierApiUpstreamUrl('Suplier/GetSuplierLeadList'), {
      method: 'POST',
      headers: {
        ...SUPPLIER_AUTH_HEADER,
        'Content-Type': upstreamContentType,
      },
      body: upstreamBody,
      cache: 'no-store',
    });

    return forwardSupplierJsonResponse(response, 'GetSuplierLeadList');
  } catch (error) {
    console.warn('[supplier-api] GetSuplierLeadList fetch failed:', error);
    return NextResponse.json(
      { error: 'Proxy fetch failed' },
      { status: 502, headers: SUPPLIER_CORS_HEADERS },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: SUPPLIER_CORS_HEADERS,
  });
}

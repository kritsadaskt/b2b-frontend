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

    const response = await fetch(supplierApiUpstreamUrl('Suplier/SaveSuplier'), {
      method: 'POST',
      headers: {
        ...SUPPLIER_AUTH_HEADER,
        'Content-Type': 'application/json',
      },
      body,
      cache: 'no-store',
    });

    return forwardSupplierJsonResponse(response, 'SaveSuplier');
  } catch (error) {
    console.warn('[supplier-api] SaveSuplier fetch failed:', error);
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

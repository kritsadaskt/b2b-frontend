import { NextResponse } from 'next/server';
import { supplierApiUpstreamUrl } from '../../../utils/supplierUpstream';
import {
  forwardSupplierJsonResponse,
  SUPPLIER_AUTH_HEADER,
  SUPPLIER_CORS_HEADERS,
} from '../../../utils/supplierProxy';

export async function GET() {
  try {
    const response = await fetch(supplierApiUpstreamUrl('Suplier/GetSuplierLeads'), {
      method: 'GET',
      headers: {
        ...SUPPLIER_AUTH_HEADER,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    return forwardSupplierJsonResponse(response, 'GetSuplierLeads');
  } catch (error) {
    console.warn('[supplier-api] GetSuplierLeads fetch failed:', error);
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

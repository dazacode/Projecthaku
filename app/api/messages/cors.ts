import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function corsMiddleware(request: NextRequest, response: NextResponse) {
  // Allow requests from any origin
  response.headers.set('Access-Control-Allow-Origin', '*');
  
  // Allow specific methods
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Allow specific headers
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200,
      headers: response.headers
    });
  }

  return response;
}

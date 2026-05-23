import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const WORKBENCH_PASSCODE = process.env.WORKBENCH_PASSCODE || 'northstar-dev';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const passcode = formData.get('passcode');
  
  const url = request.nextUrl.clone();
  
  if (passcode === WORKBENCH_PASSCODE) {
    const callback = formData.get('callbackUrl');
    url.pathname =
      typeof callback === 'string' && callback.startsWith('/workbench')
        ? callback
        : '/workbench';
    const response = NextResponse.redirect(url);
    // Set cookie for 30 days
    response.cookies.set('workbench_auth', WORKBENCH_PASSCODE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    return response;
  }
  
  // Redirect back to auth with error
  url.pathname = '/workbench/auth';
  url.searchParams.set('error', '1');
  return NextResponse.redirect(url);
}

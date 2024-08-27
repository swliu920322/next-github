import { NextRequest, NextResponse } from 'next/server';
import { config as configs } from '@/config.mjs';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith('/github')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Accept', 'application/json');
    requestHeaders.set('Content-Type', 'application/json');
    let githubAuth = request.cookies.get('githubAuth')?.value;
    if (githubAuth) {
      const { access_token, token_type } = JSON.parse(githubAuth);
      requestHeaders.set('Authorization', `${token_type} ${access_token}`);
    }
    const newReq = { request: { ...request, cookie: '', headers: requestHeaders } };
    const newPath = pathname.slice(7);
    return NextResponse.rewrite(`${configs.github.github_base_url}${newPath}${search}`, newReq);
  }
}

export const config = {
  matcher: '/github/:path*',
};

import { NextRequest, NextResponse } from 'next/server';

const github_base_url = 'https://api.github.com';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Content-Type', 'application/json');
  const newReq = { request: { ...request, headers: requestHeaders } };
  if (pathname.startsWith('/github')) {
    let githubAuth = request.cookies.get('githubAuth')?.value;
    if (githubAuth) {
      const { access_token, token_type } = JSON.parse(githubAuth);
      requestHeaders.set('Authorization', `${token_type} ${access_token}`);
    }
    const newPath = pathname.slice(7);
    return NextResponse.rewrite(`${github_base_url}${newPath}`, newReq);
  }
  return NextResponse.next(newReq);
}

// export const config = {
//   matcher: '/github',
// };

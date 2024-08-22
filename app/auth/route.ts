import { config } from '@/config.mjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const {
  github: { client_id, client_secret, gitAccess, gitUser },
} = config;

function getToken(code: string) {
  return fetch(gitAccess, {
    method: 'POST',
    body: JSON.stringify({ client_id, client_secret, code }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((r) => r.json())
    .catch(() => new Response('get Token Error', { status: 500 }));
}

// 解析code
// 向github请求获得token
// 继续请求获得用户信息
function getUserInfo(token_type, access_token) {
  return fetch(gitUser, {
    method: 'POST',
    headers: { Authorization: `${token_type} ${access_token}` },
  })
    .then((r) => r.json())
    .catch(() => new Response('get UserInfo Error', { status: 500 }));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const code = searchParams.get('code');
  if (code) {
    const result = await getToken(code);
    cookies().set('githubAuth', JSON.stringify(result));
    const { access_token, token_type } = result;
    const userInfo = await getUserInfo(token_type, access_token);
    cookies().set('userInfo', JSON.stringify(userInfo));
    return redirect(cookies().get('path')?.value || '/');
  }
  return new Response('code no exist', { status: 500 });
}

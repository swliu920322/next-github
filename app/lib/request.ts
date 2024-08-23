'use server';
import { cookies } from 'next/headers';
import { config } from '@/config.mjs';

export async function request(url: string, others?: any) {
  let githubAuth = cookies().get('githubAuth')?.value;
  const newPath = config.github.github_base_url + url.slice(7);
  const request = new Request(newPath);
  if (githubAuth) {
    const { access_token, token_type } = JSON.parse(githubAuth);
    request.headers.set('Authorization', `${token_type} ${access_token}`);
    request.headers.set('Accept', 'application/json');
    request.headers.set('Content-Type', 'application/json');
    return fetch(request, others).then((r) => r.json());
  }
  return null;
}

'use server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  let data = await request.json();
  // console.log(data);
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  cookies().set(data.key, data.value);
  console.log('cookie', cookies().getAll());
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `${data.key}=${data.value}` },
  });
}

'use server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const data = await request.json();
  cookies().set('path', data.pathName);
  return new Response('Hello, Next.js!', {
    status: 200,
    // headers: { 'Set-Cookie': `path=${data.pathName}` },
  });
}

'use server';
import { cookies } from 'next/headers';

export async function GET() {
  cookies().delete('githubAuth');
  cookies().delete('userInfo');
  return new Response('logout success', { status: 200 });
}

import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  // const token = cookieStore.get('token')
  cookieStore.set('path', '111');
  console.log(request);
  // cookieStore.set('url',  )
  return new Response('Hello, Next.js!', {
    status: 200,
    // headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
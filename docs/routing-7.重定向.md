在nextjs有很多方式处理重定向，

| 方式 | 目的 | 用处 | 状态码 |
| --- | --- | --- | --- |
| [redirect](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirect-function) | 在事件触发后重定位用户页面 | Server Component
Server Action
Router Handle | 307(Temporary)
303(Server Action) |
| [permanentRedirect](https://nextjs.org/docs/app/building-your-application/routing/redirecting#permanentredirect-function) |  |  | 308 |
| [useRouter](https://nextjs.org/docs/app/building-your-application/routing/redirecting#userouter-hook) | 执行客户端跳转 | 客户端事件处理 | 
 |
| [redirectsinnext.config.js](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs) | 重定向一个内部路径的请求 | `next.config.js` file | 
 |
| [NextResponse.redirect](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware) | 基于条件请求一个内部的重定向 | Middleware | 
 |

### redirect 函数（[redirectAPI reference](https://nextjs.org/docs/app/api-reference/functions/redirect) ）
允许你重定向到其他URL，可以在Server Component、Server Action、Router Handle中，
redirect通常用在一个事件之后
```jsx
export async function createPost(id: string) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }
 
  revalidatePath('/posts') // Update cached posts
  redirect(`/post/${id}`) // Navigate to the new post page
}
```

- redirect内部可以抛出错误，可以在try/catch外面调用
- redirect可以在渲染过程的客户端使用，但是不能在事件处理中，使用useRouter代替
- redirect接受其它参数，可以跳转到外部网站
- 如果想要在渲染之前跳转，使用[next.config.js](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs) or [Middleware](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware).
### [permanentRedirect](https://nextjs.org/docs/app/building-your-application/routing/redirecting#permanentredirect-function)
允许你永久重定向到另一个URL
通常用于改变了信息，然后重新跳转到新的信息内容。
```jsx
'use server'
 
import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
 
export async function updateUsername(username: string, formData: FormData) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }
 
  revalidateTag('username') // Update all references to the username
  permanentRedirect(`/profile/${username}`) // Navigate to the new user profile
}
```
### useRouter
在客户端组件中需要重定向，可以使用push方法
```jsx
'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```
### nextjs.config.js的redirect
允许你通过配置，重定向到不同的路径，支持path，header，cookie，和query matching
```jsx
module.exports = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      // Wildcard path matching
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}
```
redirects可能在平台上有限制，在Vercel，有1024次限制重定向。可以考虑使用Middleware创建自定义解决方案。
### [NextResponse.redirectin Middleware](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware)
中间件允许在请求完成之前运行代码，基于来到的请求，重定向到其他地方，类似于SPA的路由拦截。
基于条件来判断重定向。
```jsx
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'
 
export function middleware(request: NextRequest) {
  const isAuthenticated = authenticate(request)
 
  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    return NextResponse.next()
  }
  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}
 
export const config = {
  matcher: '/dashboard/:path*',
}
```
### 大规模管理重定向（进阶）
要管理1000+的大规模，可以考虑使用中间件创造一个自定的解决方案，允许你通过程序处理重定向而不是重新部署你的应用。你需要

1. 创建存储一个重定向的地图
2. 优化数据查询性能。

例子： [Middleware with Bloom filter](https://redirects-bloom-filter.vercel.app/)

1. 创建存储一个重定向的地图

重定向地图是你需要存在数据库中的，数据结构类似这样
```jsx
{
  "/old": {
    "destination": "/new",
    "permanent": true
  },
  "/blog/post-old": {
    "destination": "/blog/post-new",
    "permanent": true
  }
}
```
在中间件中，你可以从数据库读取。然后基于来的请求重定向
```jsx
import { NextResponse, NextRequest } from 'next/server'
import { get } from '@vercel/edge-config'
 
type RedirectEntry = {
  destination: string
  permanent: boolean
}
 
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)
 
  if (redirectData && typeof redirectData === 'string') {
    const redirectEntry: RedirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }
 
  // No redirect found, continue without redirecting
  return NextResponse.next()
}
```

2. 优化数据查询性能

对于每一个请求读取大量数据会很慢，开销很昂贵。有两种方式可以优化数据查询性能。

- 使用快速读取的数据库，类似Redis
- 使用类似[Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter) 的数据查询策略来提高效率。如果重定向在读取大量数据之前。
```jsx
import { NextResponse, NextRequest } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'
 
type RedirectEntry = {
  destination: string
  permanent: boolean
}
 
// Initialize bloom filter from a generated JSON file
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any)
 
export async function middleware(request: NextRequest) {
  // Get the path for the incoming request
  const pathname = request.nextUrl.pathname
 
  // Check if the path is in the bloom filter
  if (bloomFilter.has(pathname)) {
    // Forward the pathname to the Route Handler
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )
 
    try {
      // Fetch redirect data from the Route Handler
      const redirectData = await fetch(api)
 
      if (redirectData.ok) {
        const redirectEntry: RedirectEntry | undefined =
          await redirectData.json()
 
        if (redirectEntry) {
          // Determine the status code
          const statusCode = redirectEntry.permanent ? 308 : 307
 
          // Redirect to the destination
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
 
  // No redirect found, continue the request without redirecting
  return NextResponse.next()
}
```
```jsx
import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'
 
type RedirectEntry = {
  destination: string
  permanent: boolean
}
 
export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }
 
  // Get the redirect entry from the redirects.json file
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]
 
  // Account for bloom filter false positives
  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }
 
  // Return the redirect entry
  return NextResponse.json(redirect)
}
```

- 要生成一个boom过滤器，你可以使用库类似 [bloom-filters](https://www.npmjs.com/package/bloom-filters)
- 在路由处理前，你需要验证请求，去阻止一些恶意请求。

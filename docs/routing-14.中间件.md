中间件允许你在请求完成之前运行代码。基于进来的请求，你可以通过重写，重定位，修改请求响应头或直接响应来修改响应
中间件在缓存内容和路由匹配之前允许，查看[Matching Paths](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths)来获取更多信息。
## 用例
在应用里集成中间价可以在性能、安全和用户体验上有显著的提升，中间件在一些常见的尤其有用

- 认证和授权：在允许用户到特定页面和URI前确保用户认证和session检查
- 服务端的重定向：在特定条件下在服务端重定向用户(本地化，用户角色)
- 路径重写：支持A/B测试，功能发布，根据请求和动态来重写请求路径API或页面。
- 机器人检查：保护你的资源，检测和阻塞机器人攻击
- 日志和分析：在处理页面或API捕获或分析请求数据
- 功能标记：开关一些动态特性用来无缝功能关闭测试

也有不适合的场景

- 复杂数据的获取和操作：中间价不是为负责数据的获取操作而设计的，这个应该在路由处理或服务端实现
- 繁重的计算任务：中间件应该是轻量和快速响应的，不然会导致页面加载延迟。繁重的计算或长时间运行应该在路由处理(Router handle)中执行
- 广泛的session管理：尽管中间价可以管理基本的session任务，广泛的session管理应该在认证服务和路由处理中进行
- 直接的数据库操作：不推荐直接操作数据库，应该在路由处理中或服务端应用程序。
## 习俗
在项目的根目录使用middleware.ts来定义中间件，在app的同级，如果有src就在src里

- 项目只支持一个middleware.ts,可以模块化的组织，分成多个ts文件，在主middleware导入
- 可以更干净的管理，集中控制，只有一个middleware文件，简化了配置，防止潜在的冲突，避免了多个middleware试图，优化了性能。
### 例子
```jsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/about/:path*',
}
```
### 匹配路径[Matching Paths](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths)
中间价会在项目的每个路由中调用。精准定位和排除一些特殊的路由是很关键的。下面是执行顺序

1. `headers` from `next.config.js`
2. `redirects` from `next.config.js`
3. Middleware (`rewrites`, `redirects`, etc.)
4. `beforeFiles` (`rewrites`) from `next.config.js`
5. Filesystem routes (`public/`, `_next/static/`, `pages/`, `app/`, etc.)
6. `afterFiles` (`rewrites`) from `next.config.js`
7. Dynamic Routes (`/blog/[slug]`)
8. `fallback` (`rewrites`) from `next.config.js`

有两种方式可以定义中间件允许的路径

1. 自定义matcher文件 [Custom matcher config](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)
2. 条件判断 [Conditional statements](https://nextjs.org/docs/app/building-your-application/routing/middleware#conditional-statements)
#### Matcher
matcher允许你在一些特定的路径运行过滤的中间件
```jsx
// middleware.js
export const config = {
  matcher: '/about/:path*',
}
// 你可以匹配一个或多个路径通过数组
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
// 允许使用正则，下面是匹配所有通用路径外的路径。
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
// 也可以使用missing or has 数组通过中间件绕过某些请求。
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    },
  ],
}
```

- matcher 值应该是常量，所以可以在构建时候静态分析，动态值会被忽略

配置匹配符：

- 必须以'/'开始
- 可以包含具名参数 `/about/:path` matches `/about/a` and `/about/b` but not `/about/a/c`
- 可以对命名参数进行修饰符(以：开始) `/about/:path*` matches `/about/a/b/c` because `*` is 零个或多个 `?` is 0或1 and `+` _1或多_
- _可以使用括号的正则表达式_: `/about/(.*)` is the same as `/about/:path*`

为了向后兼容：nextjs 将`/public` as `/public/index`,所以/public/:path 会匹配上

#### 条件语法
```jsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }
 
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```
##### NextResponse 

- redirect 将进来的请求转到其他URL
- rewrite 通过被给定的URL重写响应
- 对API路由设置请求头，`getServerSideProps`, and `rewrite` 目标
- 设置响应cookies
- 设置响应headers

为了在中间件产生一个响应，你可以

1. rewrite重写一个route(页面或路由处理)，产生一个响应
2. 直接返回一个NextResponse（[Producing a Response](https://nextjs.org/docs/app/building-your-application/routing/middleware#producing-a-response)）
### 使用cookies
cookies是常规headers，在一个Request中，被存储在Cookie头，在一个Response中，在Set-Cookie头，nextjs通过继承NextRequest和NextResponse提供了一个访问cookies更方便的方式。

1. 对于传入的请求，cookies有`get`, `getAll`, `set`, and `delete`方法，你也可以使用继承方法，has用来检查，clear用来清除所有。
2. 对于传出去的响应，cookies有`get`, `getAll`, `set`, and `delete`.
```jsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]
 
  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false
 
  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.
 
  return response
}
```
### 设置headers
可以使用NextResponse API来设置Request和Response（nextjs 13.0可以)
```jsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')
 
  // You can also set request headers in NextResponse.next
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })
 
  // Set a new response header `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
```

- 避免设置大的headers因为他会导致431[Request Header Fields Too Large](https://developer.mozilla.org/docs/Web/HTTP/Status/431) ，取决于你的后端服务器配置。
### CORS
你可以在中间件中设置CORS Header，允许跨域请求，包含[simple](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) and [preflighted](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)请求
```jsx
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
 
const allowedOrigins = ['https://acme.com', 'https://my-app.org']
 
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
 
export function middleware(request: NextRequest) {
  // Check the origin from the request
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)
 
  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS'
 
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }
 
  // Handle simple requests
  const response = NextResponse.next()
 
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
 
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
 
  return response
}
 
export const config = {
  matcher: '/api/:path*',
}
```

- 你也可以在 [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#cors) 中为独立的请求配置CORS headers
### 产生一个Response
你可以直接在中间件通过返回一个Response或NextResponse实例(Next.js 13.0+)
```jsx
// middleware.ts
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@lib/auth'
 
// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
}
 
export function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  if (!isAuthenticated(request)) {
    // Respond with JSON indicating an error message
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```
### [waitUntil and NextFetchEvent](https://nextjs.org/docs/app/building-your-application/routing/middleware#waituntil-and-nextfetchevent)
NextFetchEvent对象继承了原生的[FetchEvent](https://developer.mozilla.org/docs/Web/API/FetchEvent) 对象，包含[waitUntil()](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil)方法
[waitUntil()](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil)方法接受一个Promise参数，继承了中间件的生命周期直到Promise被释放，对于后台执行的内容有用
```jsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
 
export function middleware(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://my-analytics-platform.com', {
      method: 'POST',
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    })
  )
 
  return NextResponse.next()
}
```
### 高级中间价
13.1开始 
`skipMiddlewareUrlNormalize` and `skipTrailingSlashRedirect`用来处理高级
`skipTrailingSlashRedirect` 禁止Nextjs重定向对于尾部斜杠添加和删除,这允许中间件内部的自定义处理为某些路径维护尾斜杠，而不是其他路径，这可以使增量迁移更容易
```jsx
// next.config.js
module.exports = {
  skipTrailingSlashRedirect: true,
}
const legacyPrefixes = ['/docs', '/blog']
// middleware.js
export default async function middleware(req) {
  const { pathname } = req.nextUrl
 
  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }
 
  // apply trailing slash handling
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    return NextResponse.redirect(
      new URL(`${req.nextUrl.pathname}/`, req.nextUrl)
    )
  }
}
```
skipMiddlewareUrlNormalize允许在Next.js中禁用URL规范化，以使处理直接访问和客户端转换相同。在某些高级情况下，此选项通过使用原始URL提供完全控制
```jsx
// next.config.js
module.exports = {
  skipMiddlewareUrlNormalize: true,
}
// middleware.js
export default async function middleware(req) {
  const { pathname } = req.nextUrl
 
  // GET /_next/data/build-id/hello.json
 
  console.log(pathname)
  // with the flag this now /_next/data/build-id/hello.json
  // without the flag this would be normalized to /hello
}
```
### 运行时
中间件当前只支持 [Edge runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes).不能够

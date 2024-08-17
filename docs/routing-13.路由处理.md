路由处理允许你创建自定义请求处理，对于给定的路由，使用Web的[Request](https://developer.mozilla.org/docs/Web/API/Request) and [Response](https://developer.mozilla.org/docs/Web/API/Response)。
![截屏2024-08-17 上午11.55.52.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723866955192-770e2c07-4393-48ec-9932-e19aa744b590.png#averageHue=%23f5f5f5&clientId=u8d871448-6188-4&from=drop&height=160&id=ubef825df&originHeight=290&originWidth=776&originalType=binary&ratio=2&rotation=0&showTitle=false&size=88602&status=done&style=none&taskId=u0b88d520-ffdc-4cdb-819e-2fccd7f6046&title=&width=427)

- 路由处理只在app路径生效，他们相当于app里的API路由。意味着你不用同时使用API路由和路由处理。
## 习俗
路由处理定义在app的route.ts。
```jsx
// app/api/route.ts
export async function GET(request: Request) {}
```
路由处理可以在app里随意嵌套，类似page和layout，但是不能想page在同一级重复。
### 支持HTTP方式
支持一下HTTP，GET,POST,PUT,PATCH,DELETE,HEAD和OPTIONS,不支持的返回405Method Not Allowed
### 继承NextRequest和NextResponse API
为了额外支持Request和ResponseAPI，Nextjs通过NextRequest和NextResponse对进阶使用来提供更好的帮助
## 行为
### 缓存
路由处理默认不会缓存，你可以通过GET方法缓存，使用[route config option](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)例如在你的路由处理文件
export const dynamic = 'force-static'
```jsx
// app/items/route.ts
export const dynamic = 'force-static'
 
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
 
  return Response.json({ data })
}
```
### 特殊的路由处理
特殊的路由处理,类似[sitemap.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [opengraph-image.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), and [icon.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)，还有其他的[metadata files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)默认保持静态，除非使用动态方法或者动态配置。
### 路由解决方案
你可以将route是最底层的路由。

- 不会加入到layout或客户端导航
- 不能有page.js和route.js在同一个路由
| **Page** | **Route** | **Result** |
| --- | --- | --- |
| `app/page.js` | `app/route.js` |  Conflict |
| `app/page.js` | `app/api/route.js` |  Valid |
| `app/[user]/page.js` | `app/api/route.js` |  Valid |

每一个route和page会接受该路由的所有http方法。
```jsx
// app/page.js
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
 
// ❌ Conflict
// `app/route.js`
export async function POST(request) {}
```
### Example例子
下面的例子展示了如何和nextjs API和特性 绑定路由处理
#### 重新验证缓存数据
可以使用[next.revalidate](https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating#revalidating-data)
```jsx
// app/items/route.ts
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })
  const data = await res.json()
 
  return Response.json(data)
}
// 你可以使用 revalidate配置
export const revalidate = 60
```
#### 动态方案
路由可以用于nextjs的动态方法，类似cookie和headers
##### cookies
你可以用next/headers设置cookie，这个服务端方法在路由处理中可以直接被调用，或者嵌套在其他方法中
你可以使用[Set-Cookie](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)返回一个新的**Response**
```jsx
// app/api/route.ts
import { cookies } from 'next/headers'
 
export async function GET(request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
 
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```
你也可以使用Web Api来从请求(NextRequest)中读取cookies
```jsx
// app/api/route.ts
import { type NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')
}
```
##### headers
你可以使用next/headers从headers读取headers. 可以在路由处理中直接调用这个服务器方法，或者嵌套在其他方法中
这个headers实例是只读的，要想设置headers，你可以返回一个带有新的Response的新headers
```jsx
// app/api/route.ts
import { headers } from 'next/headers'
 
export async function GET(request: Request) {
  const headersList = headers()
  const referer = headersList.get('referer')
 
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```
你也可以使用WebApi读取headers
```jsx
// app/api/route.ts
import { type NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
}
```
#### 重定向
```jsx
// app/api/route.ts
import { redirect } from 'next/navigation'
 
export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```
#### 动态路由段
路由处理 可以使用[Dynamic Segments](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)来创建来自动态数据的请求处理
```jsx
// app/items/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug // 'a', 'b', or 'c'
}
```
| **Route** | **Example URL** | `**params**` |
| --- | --- | --- |
| `app/items/[slug]/route.js` | `/items/a` | `{ slug: 'a' }` |
| `app/items/[slug]/route.js` | `/items/b` | `{ slug: 'b' }` |
| `app/items/[slug]/route.js` | `/items/c` | `{ slug: 'c' }` |

#### URL 请求参数
在一个 NextRequest实例中传递一个请求对象给路由处理，有一些额外的便利方法，包含一些更加简单处理请求参数。
```jsx
// app/api/search/route.ts
import { type NextRequest } from 'next/server'
 
export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello
}
```
#### 流式
流式通常用于和大语言模型绑定，类似open-ai，[AI SDK](https://sdk.vercel.ai/docs/introduction)
```jsx
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'
 
export async function POST(req) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })
 
  return new StreamingTextResponse(result.toAIStream())
}
```
这些使用Web Api的抽象方法，也可以直接使用Web Api

```jsx
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
 
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}
 
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
 
const encoder = new TextEncoder()
 
async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}
 
export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)
 
  return new Response(stream)
}
```
#### 请求体
你可以通过标准Web Api方式去读请求body
```jsx
// app/items/route.ts
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```
#### formData请求体
```jsx
export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```
因为formData数据都是string的，你可以使用[zod-form-data](https://www.npmjs.com/zod-form-data)来验证请求数据
#### 跨域CORS
可以通过使用标准Web Api方法来设置CORS头对特定的路由处理
```jsx
export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

- 要在多个路由处理中增加跨域，可以在next.config.file中使用[Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware#cors) 
- 此外，可以看这个例子[CORS example](https://github.com/vercel/examples/blob/main/edge-functions/cors/lib/cors.ts)
#### Webhooks
你可以使用路由处理来接受来自第三方的webhooks
```jsx
// app/api/route.ts
export async function POST(request: Request) {
  try {
    const text = await request.text()
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }
 
  return new Response('Success!', {
    status: 200,
  })
}
```
明显，不像路由处理的API,你不需要使用**bodyParser **来使用额外的配置
#### 没有UI的Response
可以使用路由处理来返回一些没UI的内容，注意到[sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts), [robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file), [app icons](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx), and [open graph images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)都有内置支持。
```jsx
// app/rss.xml/route.ts
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
 
<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>
 
</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
```
#### 段配置选项
路由处理使用了类似pages和layouts的路由参数配置。
```jsx
// app/items/route.ts
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
```
有关文档：[API reference](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)


##  

## App Router
 App router 是基于 React Server Component的新架构，
app文件里的组件默认是 React Server Component，可以有更好的优化性能，很容易的使用它们。
### 路由

- Layout	布局
- page		页面
- loading	载入UI
- not-found	找不到的UI
- error		错误时的UI
- global-error	全局错误UI
- route		API 接口端
- template	重新渲染的UI
- default	平行页面回退页（page）

![截屏2024-08-11 下午12.09.17.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723349360526-459256fa-fb9a-48a8-bb3a-37ce2ff1554d.png#averageHue=%23f6f6f6&clientId=ua34dadb8-3a86-4&from=drop&height=136&id=LLb9f&originHeight=432&originWidth=1104&originalType=binary&ratio=2&rotation=0&showTitle=false&size=194482&status=done&style=none&taskId=ud7756c5d-0cd1-40ca-baf2-4556f8f5299&title=&width=348)![截屏2024-08-11 下午12.09.24.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723349367444-365b95c5-1f70-4e49-86f3-6b2117b99869.png#averageHue=%23cfd1d0&clientId=ua34dadb8-3a86-4&from=drop&height=174&id=yYNAE&originHeight=608&originWidth=1070&originalType=binary&ratio=2&rotation=0&showTitle=false&size=262817&status=done&style=none&taskId=u97dd60b6-4e1c-472b-9a54-ddca4354587&title=&width=307)
### 进阶路由
Approuter提供了更高级的路由

- [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes) 可以在一个视图里展示多个页面，可以用来分割
- [Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes) 允许你拦截路由在其他路由的上下文中展示它，可以使用它保持当前页面的上下文

## 定义路由
只有page页面才可以被访问
## pages
pgaes是独特的ui，作为文件中的首页。
## layout and template
layout是一个可以被共享的视图，维持状态,保持互动，不会重新渲染，可以被嵌套。
接受一个children作为参数 在渲染的时候填充
### 根layout
是顶级的，必须包含html和body
### 嵌套layout
layout属于服务端组件，但是可以被设置为客户端组件
layout可以查询数据[Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
不可以传递数据给children，你可以获取同一个数据在路由里超过多次，react会自动删除重复的请求不会影响性能
layout不可以使用pathname，导入客户端组件可以使用usePathname hook
layout不可以访问自身下面的路由参数，可以使用 [useSelectedLayoutSegment](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment)和[useSelectedLayoutSegments](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments)在客户端组件中
可以使用 [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) 在共享路由组中选择特定的路由，创建多个跟路由，[example here](https://nextjs.org/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts).
### template
类似layout，可以包裹child layout或page，不同于layout可以跨路由快递和保持状态，template每次都是新的实例，对于children和navigation。意味着用户在路由间导航共享一个template，当一个新的child 实例被挂载，dom元素会被重新创建，状态不会在client component中维护，状态被重新同步。
当你需要下面具体行为时，template比layout更合适。

- 在导航的时候重新触发 useEfffect
- 在导航的时候重置 child client component的状态。

模板类似layout，在layout和children之间渲染。
#### examples

- Metadata 可以在layout或page中定义
```bash
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Next.js',
}
 
export default function Page() {
  return '...'
}
```

- 注意 你不必手动增加title 和meta 对于根layout， 使用[Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) 会自动处理
#### 当前激活的导航链接 nav links
可以使用[usePathname()](https://nextjs.org/docs/app/api-reference/functions/use-pathname) hook来确定当前路径
## 链接和导航
### 导航介绍
next有四种方式导航

- 使用Link 组件
- 使用[useRouterhook](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#userouter-hook) (client component)
- 使用[redirectfunction](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#redirect-function) 方法(server component)
- 使用原生的[History API](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api)
#### Link 组件
是一个基于a标签的内置组件，提供[prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)和客户端路由间的导航，它是nextjs主要推荐的导航方式
```bash
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

- 禁用滚动，默认导航行为是跳转并滚动到最上面
```bash
router.push('/dashboard', { scroll: false })
<Link href="/dashboard" scroll={false}>
  Dashboard
</Link>
```
#### useRouter() hook
允许在client 组件中以编程方式跳转其他页面。更多用法可以查看 [API reference](https://nextjs.org/docs/app/api-reference/functions/use-router)
#### redirect 函数
对于服务端组件，使用[redirectAPI reference](https://nextjs.org/docs/app/api-reference/functions/redirect)
```bash
import { redirect } from 'next/navigation'
redirect('/login')
```

- redirect 默认返回307状态，在Server Action时返回303，作为一个post请求重定向一个成功的页面。
- redirect在内部抛出一个错误时，可以被try/catch捕获，
- redirect在渲染过程中可以被client component 调用，但是不会进入事件处理，可以使用useRouter代替
- redirect可以接受绝对路径，并且可以用到导航去外部网站
- 如果你想要在渲染过程前面重定向，使用[next.config.js](https://nextjs.org/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs) or [Middleware](https://nextjs.org/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware)
#### 使用原始history API
nextjs允许你使用原始[window.history.pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)和[window.history.replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
```bash
window.history.pushState(null, '', `?${params.toString()}`)
window.history.replaceState(null, '', newPath)
```
### 导航如何工作
App router 使用了混合的可用导航路由，

- 在服务端，应用代码自动被route segments 代码切分。
- 在客户端，预加载和缓存route segments

意味着，导航到新路由，浏览器不会reload，只有影响重渲染的route segments才会导致reload，这能提高导航体验和性能。
### [Code Splitting](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#1-code-splitting)
允许你切割你的应用代码变得更小，被浏览器下载和执行。减少了数据传输量并且在每次请求时才执行，提高了性能。
[Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components) 允许你的应用代码自动被route segments切割。这个意味只有当前路由需要的时候才会被下载。
### [Prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
它可以在用户看到它之前在后台提前加载路由，nextjs有两种方式prefetching

- Link Component，
   - link默认就有prefetching的功能（当prop未设定或为null时）
   - 当你的loadingjs使用不同时，它也是不同的，只有在shard layout中，沿着渲染树的组件直到第一个loading.js文件被加载，可以被缓存30s，减少了获取整个动态路由的成本，意味着你可以使用[instant loading state](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states)来处理用户反馈。
   - 你可以禁用prefetching，通过设置prefetch 为 false，作为可选性，你可以设置prefetch为true，在
- `router.prefetch()`
### Caching 缓存
nextjs有一个叫[Router Cache](https://nextjs.org/docs/app/building-your-application/caching#client-side-router-cache)的内存客户端缓存。在用户导航之后，react server component 会prefetching route segments和浏览过的路由，存储在缓存里。
这个意味着在导航的时候，缓存会被尽可能的重用，进而代替对服务器发送新的请求，可以降低请求和数据传输来提高性能。
### [Partial Rendering](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering) 部分渲染
意味着只有在路由改变时，客户端的重渲染，共享的部分会被保存
### [Soft Navigation](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#5-soft-navigation)
通常浏览器执行的是hard navigation，Netxjs 路由在页面之间使用的是soft navigation，能够尽可能保持客户端的状态
### 返回和前进的导航
默认下，nextjs 会保持滚动位置，并且重用缓存的路由参数
### [Routing betweenpages/andapp/](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#7-routing-between-pages-and-app)
不推荐一起使用，可以重构的时候用，通常没问题，有问题就看下文章，

## Error处理
异常可以分为两部分，预期的异常和未捕获的异常

- 对于 服务端的操作，作为返回值的model 异常，避免使用try/ catch
- 对于未捕获的异常，使用错误边界来处理，使用error.tsx, global-error.tsx文件可以提供一个备用UI
### 处理预期的error
处理那些发生在应用普通操作的预期错误，类似[server-side form validation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation) 或失败的请求，这些错误应该被准确的处理并且返回到客户端。
#### 处理来自服务端方法的预期错误
useActionState 来管理Server Action来管理错误，应用对期待的异常避免使用了try/catch的阻塞。
应该作为返回值而不是抛出异常。可以使用返回值对客户端组件来提示信息。
```jsx
// app/actions.ts
'use server'

import { redirect } from 'next/navigation'

export async function createUser(prevState: any, formData: FormData) {
  const res = await fetch('https://...')
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Please enter a valid email' }
  }

  redirect('/dashboard')
}

'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}
// app/ui/signup.tsx
export function Signup() {
  const [state, formAction] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite">{state?.message}</p>
      <button>Sign up</button>
    </form>
  )
}
```


#### 处理来自服务器组件的预期错误
在服务端组件内部查询数据时，可以直接使用条件渲染一个错误信息，或者redirect
```jsx
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()
  if (!res.ok) {
    return 'There was an error.'
  }
  return '...'
}
```
### 未捕获的异常
未捕获异常通常是未预料的错误，有可能是bug或问题，那些在应用的流程中不应该发生的，这些通常会抛出error来处理。可以被error boundaries 捕获。

- 通常：在root layout 下的error.tsx
- 可选：细维度的可以嵌套error.tsx
- 不寻常的：在root layout下使用global-error.tsx来捕获
#### 使用error  boudaries
nextjs使用error boudaries来处理未捕获的异常。错误边界在他们的子组件捕获错误，并且展示备选ui而不会崩溃,通过新增 **error.tsx** 并将他暴露为react component组件。
如果你想要错误冒泡到父级，直接在render的时候抛出异常就行。
```jsx
'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'

export default function Error({ error, reset }: {
  error: Error & { digest?: string } reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```
#### 处理嵌套路由的error
错误会往上冒泡，你可以自定义使用error.tsx在路由的不同地方处理
#### 处理全局error
使用app/global-error.tsx。全局错误包含html和body标签
```jsx
'use client' // Error boundaries must be Client Components
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```
## 载入UI和流
特殊的文件loading.tsx可以帮助你创建有意义的载入UI，和react suspense配合。
这里，你可以展示一个** Instant loading state** 来自Server，当路由内容载入时，一旦渲染完成，新内容会被自动替换。
### **Instant loading state 瞬时加载状态**
一个瞬时加载状态是一个备用ui，在导航的时候迅速出现，可以提前渲染一些载入指示器比如骨骼和加载进度，或者有意义的内容，可以帮助用户理解应用正在响应中。
![截屏2024-08-13 下午1.30.54.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723527056190-df059210-2f1e-4d23-b7fe-9c71ac16d2b6.png#averageHue=%23f6f6f6&clientId=u54f004e4-3e2e-4&from=drop&height=234&id=u5bd7cc3a&originHeight=558&originWidth=1164&originalType=binary&ratio=2&rotation=0&showTitle=false&size=249320&status=done&style=none&taskId=u71e63061-5a75-4aca-a256-1695f814c7f&title=&width=488)

- 目前导航是立即的，
- 导航是可打断的，意味着可以在路由加载之前可以改变路由
- 共享layouts可以在载入新路由时交互，
### Streaming with Suspense
除了使用loading.tsx，可以手动使用Suspense 边界
App Router对于nodejs和eage支持Suspense的streaming
#### 什么是Streaming
理解Streaming是怎么工作的，对于理解ssr是很有帮助的。
在ssr中，在用户能够看到和页面交互之前，有一系列的步骤需要被完成。

1. 首先，所有数据都要先从服务端获取
2. 然后，服务端渲染为页面生成HTML
3. html，css，js发送给客户端
4. 使用html和css生成一个不具备用户交互的页面
5. 最后，react 会注入用户接口来让他

![截屏2024-08-13 下午2.22.32.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723530154948-cc435081-1fc7-44d4-b456-83cfad46aa85.png#averageHue=%23f6f6f6&clientId=u54f004e4-3e2e-4&from=drop&height=186&id=u3d4f6488&originHeight=430&originWidth=1086&originalType=binary&ratio=2&rotation=0&showTitle=false&size=170216&status=done&style=none&taskId=ue16332d0-d582-4dbc-b09f-bc64bc161b9&title=&width=470)
这些步骤是有序的、阻塞的，意味着每次只能进行一个操作，只有所有组件都下载完，react才会注水
同时，在客户端，react只有页面内所有组件代码下载完之后才会注水hydrate
react和next的ssr通过尽快展示一个不可以交互的页面帮助提高载入性能的感知.
尽管如此，过程仍然会很慢，当所有数据从服务端需要全部完成
Streaming这个流程允许你将html 变为更小的chunk，渐进式的从服务器发送到客户端。
![截屏2024-08-13 下午2.39.24.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723531167616-039f39b6-99f8-475f-a26c-37b6173517a0.png#averageHue=%23f6ebd6&clientId=u54f004e4-3e2e-4&from=drop&height=289&id=u140f9448&originHeight=574&originWidth=1050&originalType=binary&ratio=2&rotation=0&showTitle=false&size=236541&status=done&style=none&taskId=u5d63d035-e444-4486-94b4-4402fc642a3&title=&width=529)
这个过程确保了页面会很快的展示出来，而不用等待所有的数据下载完成才能渲染页面。
Steam与react 组件配合的很好，组件有更高的优先级，不优先依赖被发送的数据，react可以更早的注水，有更低优先级的组件可以在他们的数据获取之后发送到服务器上。
![截屏2024-08-13 下午8.13.43.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723551229457-25a1d48b-ece1-47b1-91dd-d82ed0e4e51c.png#averageHue=%231a1a1a&clientId=u54f004e4-3e2e-4&from=drop&id=uf6380551&originHeight=532&originWidth=1120&originalType=binary&ratio=2&rotation=0&showTitle=false&size=217174&status=done&style=none&taskId=ua33c6e2f-62da-41f1-b9e2-2c0ef56b579&title=)
**Streaming** 非常有用当你想要阻止来自页面请求渲染的大数据，因为它可以减少
[Time To First Byte (TTFB)](https://web.dev/ttfb/)和[First Contentful Paint (FCP)](https://web.dev/first-contentful-paint/)，同样还帮助了[Time to Interactive (TTI)](https://developer.chrome.com/en/docs/lighthouse/performance/interactive/)

- Example 

Suspense 通过包装组件，执行一个同步的操作，展示一个备用ui
```jsx
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'
 
export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```

1. Streaming Server Rendering  从服务器到客户端渐进式的渲染html
2. 有选择性的注水，React 原则是有交互性的优先
### SEO

- nextjs 在流式获取UI之前会等待内置的[generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)的获取数据，保证了流式响应的内容可以在head里
- streaming是服务器渲染的，它不会冲击SEO，你可以使用来自Google的 [Rich Results Test](https://search.google.com/test/rich-results)工具去查看你的页面在Google页面上如何展示
### 状态码
steaming时，200意味着请求时成功的。
服务器仍然可以发送错误给客户端，例如，当redirect或notFound时，由于响应头已经发送给客户端，所以无法更新状态码，但不影响SEO

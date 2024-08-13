## 特殊的文件loading.tsx可以帮助你创建有意义的载入UI，和react suspense配合。
这里，你可以展示一个** Instant loading state** 来自Server，当路由内容载入时，一旦渲染完成，新内容会被自动替换。
### **Instant loading state 瞬时加载状态**
一个瞬时加载状态是一个备用ui，在导航的时候迅速出现，可以提前渲染一些载入指示器比如骨骼和加载进度，或者有意义的内容，可以帮助用户理解应用正在响应中。
![截屏2024-08-13 下午1.30.54.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723527056190-df059210-2f1e-4d23-b7fe-9c71ac16d2b6.png#averageHue=%23f6f6f6&clientId=u54f004e4-3e2e-4&from=drop&height=234&id=jAI8w&originHeight=558&originWidth=1164&originalType=binary&ratio=2&rotation=0&showTitle=false&size=249320&status=done&style=none&taskId=u71e63061-5a75-4aca-a256-1695f814c7f&title=&width=488)

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

![截屏2024-08-13 下午2.22.32.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723530154948-cc435081-1fc7-44d4-b456-83cfad46aa85.png#averageHue=%23f6f6f6&clientId=u54f004e4-3e2e-4&from=drop&height=186&id=SdzSU&originHeight=430&originWidth=1086&originalType=binary&ratio=2&rotation=0&showTitle=false&size=170216&status=done&style=none&taskId=ue16332d0-d582-4dbc-b09f-bc64bc161b9&title=&width=470)
这些步骤是有序的、阻塞的，意味着每次只能进行一个操作，只有所有组件都下载完，react才会注水
同时，在客户端，react只有页面内所有组件代码下载完之后才会注水hydrate
react和next的ssr通过尽快展示一个不可以交互的页面帮助提高载入性能的感知.
尽管如此，过程仍然会很慢，当所有数据从服务端需要全部完成
Streaming这个流程允许你将html 变为更小的chunk，渐进式的从服务器发送到客户端。
![截屏2024-08-13 下午2.39.24.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723531167616-039f39b6-99f8-475f-a26c-37b6173517a0.png#averageHue=%23f6ebd6&clientId=u54f004e4-3e2e-4&from=drop&height=289&id=SgFz0&originHeight=574&originWidth=1050&originalType=binary&ratio=2&rotation=0&showTitle=false&size=236541&status=done&style=none&taskId=u5d63d035-e444-4486-94b4-4402fc642a3&title=&width=529)
这个过程确保了页面会很快的展示出来，而不用等待所有的数据下载完成才能渲染页面。
Steam与react 组件配合的很好，组件有更高的优先级，不优先依赖被发送的数据，react可以更早的注水，有更低优先级的组件可以在他们的数据获取之后发送到服务器上。
![截屏2024-08-13 下午8.13.43.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723551229457-25a1d48b-ece1-47b1-91dd-d82ed0e4e51c.png#averageHue=%231a1a1a&clientId=u54f004e4-3e2e-4&from=drop&id=JGzpq&originHeight=532&originWidth=1120&originalType=binary&ratio=2&rotation=0&showTitle=false&size=217174&status=done&style=none&taskId=ua33c6e2f-62da-41f1-b9e2-2c0ef56b579&title=)
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

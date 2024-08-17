平行路由允许你在一个layout中渲染一个或多个page，对于应用程序的动态部分非常有用，比如说dashboard,（并不是同时出现，类似vue的keep-alive)
例如下面的，你可以使用
![截屏2024-08-15 下午3.22.24.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723706547054-ef9cc42e-128d-4c67-b5af-0fc3cd808174.png#averageHue=%23f2e6dc&clientId=u8d56556a-f954-4&from=drop&id=KX1FL&originHeight=660&originWidth=1180&originalType=binary&ratio=2&rotation=0&showTitle=false&size=257107&status=done&style=none&taskId=uaa34bd1f-1c17-421d-82e9-31c5107418c&title=)
### Slot 插槽
平行路由通过插槽创建，通过@folder处理，例如@analytics和@team
slot被作为属性传递给父layout，之后layout可以接受props，将他们与children并行渲染。
然而插槽不是路由段，不影响URL结构，例如/@analytics/views，这个URL是/views,因为@analytics只是一个插槽。

- children是一个隐式槽，app/page.js === app/@children/page.js
### 激活状态和导航
对于每一个slot，nextjs默认追踪活动状态，然而，插槽呈现的类型取决于导航的内容

- [Soft Navigation](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#5-soft-navigation) 软导航，在客户端导航的时候，nextjs执行[partial render](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#4-partial-rendering)(部分渲染),改变当前的slot，同时保持着其他的slot的活动，即使URl不匹配
- **Hard Navigation**硬导航，在整页面刷新的时候，nextjs不能够决定与当前URl不匹配的slots激活状态，他会渲染default.js文件对于不匹配的slots，或者404如果不存在default.js
   - 404避免了你不会意外在页面上呈现非预期的并行路由
#### default.js
在首次加载或整页刷新的时候，对于不匹配的slots，你可以定义default.js来渲染备用UI
```jsx
app
---@team
  ---settings
    ---page.js
---@analytics
  ---default.js
  ---page.js
---default.js
---layout.js
---page.js
```
当导航到/setting, @team 插槽会渲染，同时保持着当前激活页面的 @analytics插槽
当刷新时，nextjs会渲染default.js对于@analytics，如果没有default.js，404会替代
此外，因为children是一个隐式slot，你也可以创建一个default.js来设置一个备用UI，如果nextjs不能回复激活状态时。
### [useSelectedLayoutSegment(s)](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#useselectedlayoutsegments)
[useSelectedLayoutSegment](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment) and [useSelectedLayoutSegments](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments) 都接受一个parallelRoutesKey参数
允许你在slot里面读取激活的route段
```jsx
'use client'
 
import { useSelectedLayoutSegment } from 'next/navigation'
 
export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegment = useSelectedLayoutSegment('auth')
  // ...
}
```
当用户导航到app/@auth/login(url上的/login），loginSegment就是字符串login
### 例子
你可以使用平行路由根据不同确定的条件来渲染路由，类似用户角色，例如不同的看板对于/user和/admin
```jsx
import { checkUserRole } from '@/lib/auth'
export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return <>{role === 'admin' ? admin : user}</>
}
```
### Tab 组
你可以在插槽中增加一个layout.js文件来允许用户独立的导航到插槽，这个有助于创建tabs
例如，@analytics插槽有两个子页面/page-views和/visitors
```jsx
app
---@analytics
  ---page-views
    ---page.js
  ---visitors
    ---page.js
  ---layout
// app/@analytics/layout.tsx
import Link from 'next/link'
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/page-views">Page Views</Link>
        <Link href="/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
```
### Modals 模式
平行路由可以和拦截路由一起使用创建支持深度链接的模式，允许你在构建模式时解决常见的挑战。例如

- 使模态内容可以通过URL共享
- 在页面刷新时保留上下文，而不是关闭
- 在后退时关闭模式，而不是跳转到上一个页面
- 重新前进重开模式

例子，考虑一下UI，一个用户可以在layout中打开login框，也可以直接访问/login 页面
```jsx
app
---@auth
  ---login
  ---signup
---layout
---page.js
```
为了实现这个，创建一个/login路由，来渲染你的主要login页面
```jsx
app
---@auth
  ---login
  ---signup
---login +
  ---page.js +
---layout
---page.js
// app/login/page.tsx
import { Login } from '@/app/ui/login'
export default function Page() {
  return <Login />
}
```
然后在@auth 插槽中增加default.js, return null.确保不激活时modal不会渲染。
```jsx
// app/@auth/default.tsx
export default function Default() {
  return '...'
}
```
在@auth 插槽中，通过/(.login)文件夹阻断 /login路由，导入<Modal>组件到/(.login)/page.tsx中
```jsx
// app/@auth/(.)login/page.tsx
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'
 
export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

- 用.于阻断路由,依赖你的文件结构，[Intercepting Routes convention](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#convention)
- 通过将Modal功能与模态内容Login分离。你可以确保任何内容在modal上，例如form。都是Server Component
#### 打开modal
要打开modal，传递@auth 插槽给父layout并且在children 附近渲染。
```jsx
// app/layout.tsx
import Link from 'next/link'
 
export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Link href="/login">Open modal</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```
当点击<Link>modal会弹开而不是导航。然而刷新或第一次进页面，导航到/login会跳转页面。
#### 关闭Modal
通过router.back()来关闭modal，或者使用Link 组件
```jsx
// app/ui/modal.tsx
'use client'
 
import { useRouter } from 'next/navigation'
 
export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
 
  return (
    <>
      <button
        onClick={() => {
          router.back()
        }}
      >
        Close modal
      </button>
      <div>{children}</div>
    </>
  )
}
```
当使用Link 组件导航离开页面时，不再会渲染@auth 插槽，我们需要平行路由匹配的是组件返回的是null。例如，当导航到根页面，我们创建一个@auth/page.tsx组件
```jsx
// app/ui/modal.tsx
import Link from 'next/link'
 
export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href="/">Close modal</Link>
      <div>{children}</div>
    </>
  )
}
// app/@auth/page.tsx
export default function Page() {
  return '...'
}
```
如果导航到其他页面,类似/foo /foo/bar.可以使用catch-all 插槽
```jsx
// app/@auth/[...catchAll]/page.tsx
export default function CatchAll() {
  return '...'
}
```

- 使用catch-all在@auth 插槽来关闭modal，因为在 [Active state and navigation](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#active-state-and-navigation)的行为描述，客户端导航到路由匹配不上的插槽会保持不可见，我们需要匹配的路由返回null，来关闭Modal
- 其他在gallery包含一个照片modal的例子都会有一个/photo/[id] 页面，或者打开一个购物车在侧边栏
- [View an example](https://github.com/vercel-labs/nextgram) modal有阻断和平行路由的例子。
### 载入和错误的UI
平行路由可以独立的通过流式传输。允许你定义独立的错误和载入状态对每个路由
![截屏2024-08-17 上午10.40.06.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723862409750-dacab236-7f5f-4fda-bd43-5f13413d8b5e.png#averageHue=%23f4f4f4&clientId=u059e535c-1a2e-4&from=drop&height=431&id=u1437002e&originHeight=940&originWidth=1228&originalType=binary&ratio=2&rotation=0&showTitle=false&size=361734&status=done&style=none&taskId=ueb52f3e7-f4f4-4129-acfd-efb08f68256&title=&width=563)
See the [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) and [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling) documentation for more information.

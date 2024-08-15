不同于路由文件和文件约定，nextjs没有固定的约定对于你组织和约定你的项目文件
本页面分享了不同的行为和特性，你可以用来组织你的文件。

- [Safe colocation by default](https://nextjs.org/docs/app/building-your-application/routing/colocation#safe-colocation-by-default)
- [Project organization features](https://nextjs.org/docs/app/building-your-application/routing/colocation#project-organization-features)
- [Project organization strategies](https://nextjs.org/docs/app/building-your-application/routing/colocation#project-organization-strategies)
### 默认的安全约定
App 目录下，嵌套文件级别定义了路由结构
每一个文件夹代表了一个路由段，用来生成一个响应的内容在URL 路径上
尽管这样，如果没有**page**或**route**文件，路由不可以被公开访问
只有page和route的返回内容才可以被访问
意味着路由文件可以被安全的约定不会被路由化

- 和**pages**架构不一样,pages 所有的文件都会被路优化
- 你可以这样组织，你也可以全部放在**app**文件外
### 项目组织特点
nextjs提供了多个特性来帮助你组织项目。
#### 私有文件夹
可以通过_创建私有文件夹
这个表明文件时私有的，不会包含在任何一个路由系统中，从而让内部文件和文件夹脱离路由
由于app默认的组织方式，私有文件夹不用托管。可以用来

- 分割路由逻辑和UI逻辑
- 在项目和nextjs生态中持续的组织内部文件
- 在代码编辑器里对文件进行排序和分组。
- 避免潜在的命名冲突，在nextjs文件系统中。
1. 可以使用_来对私有文件外的文件标记
2. 如果需要_作为路由内容，可以使用%5F来创建一个_开头的URL路段
3. 如果不用私有文件，对理解nextjs的命名冲突，会更有理解
#### 路由组
使用（）来创建路由组，表明文件夹用于组织目的的，而不是包含在URL路径中
有助于

- 以组织的方式组织路由
- 确认嵌套路由在同一个路由级别
   - 创建多个嵌套路由，包含多个顶级嵌套路由
   - 对于通用的路由中的字路由创造一个layout
#### src 目录
Nextjs允许将app文件，放在src目录下。这个在项目的根目录下分割了应用代码和项目配置文件
#### 模块别名[Module Path Aliases](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases) 
nextjs支持模块别名，使文件在导入的时候更容易阅读和维护
```jsx
// before
import { Button } from '../../../components/button'
 
// after
import { Button } from '@/components/button'
```
### 项目组织策略
在项目组织中没有对和错，以下的列表包含了一个比较高级别的视野对于通用策略。
最简单的是选择一个对你和你的团队使用的方式持续的在项目中进行。

- 我们例子中，使用components和libs来组织文件，你也可以使用ui、utils、hooks、styles...
#### 在app文件外存储项目文件
本策略以共享文件将所有的代码存储在项目的根目录。保持app文件的纯净。
```jsx
---app
  ---page.tsx
---lib
  ---date
---components
  ---componentA
```
#### 将所有的文件存储在app目录下
```jsx
app
  ---components
  ---lib
  ---page.tsx
  ---dashboard
    ---page.tsx
```
#### 将文件分割在对应的路由下（本人常用的方式，有益于持续的做文件迁移(架构调整)）
跟级别的作为共享，将一些特殊的内容放在对应的路由文件中，使用它们
```jsx
app
  ---components
  ---lib
  ---dashboard
    ---page.tsx
    ---components
    ---lib
    ---page.tsx
  ---page.tsx
```

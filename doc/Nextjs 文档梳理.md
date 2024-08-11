## 是什么（what）
nextjs 是一个构建全栈web应用的react库，可以使用react组建构建用户接口，可以做一些特性和优化。<br />nextjs有一些抽象自动化的配置工具，打包，编译等，可以开发网站而不用花太多时间在配置上。nextjs可以帮助你构建可交互，动态和快速的react应用。
## 特性（what）
| routing | 基于路由的文件系统，包括layout，nest routing，loading states，<br />handling等 |
| --- | --- |
| rendering | 客户端和服务端组件，静态和动态的渲染，Edge和node运行时 |
| data fetching | 在服务端简单的获取数据，继承了fetch Api，可以记忆请求，数据缓存和重验证 |
| styling | 多种样式支持，包括css Module，tailwindcss，css in js |
| optimizations | 图片，字库，和脚本优化，用来提高应用的核心命脉和用户体验 |
| typeScript | 支持typeScript，更好的类型检查和更多有效的变异 |

## 怎么安装
```bash
npx create-next-app@latest
```
这里推荐App Router，允许使用react最新的特性，是在 Page Router的一种革命。<br />可以同时使用App Router 和Page Router，app文件的优先级会高于pages，推荐只使用一种。
## App Router 路由文件结构

- Layout	布局
- page		页面
- loading	载入UI
- not-found	找不到的UI
- error		错误时的UI
- global-error	全局错误UI
- route		API 接口端
- template	重新渲染的UI
- default	平行页面回退页（page）


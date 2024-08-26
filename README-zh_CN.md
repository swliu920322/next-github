这个项目是 [Next.js](https://nextjs.org/) 项目
由 [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)创建而成.

## [English](./README.md) | 简体中文

## 介绍

本项目由两个版本

### Nextjs(App Router) + KOA + redis

这个是原始版本，我跟着过去的资源学习的。

#### KOA

- KOA 用来作为服务器，能够和redis数据库通信，存储一些token和用户信息。
- 前端的传递通常很容易被发现，使用koa可以代理前端的请求来处理一些加密的行为。


### Nextjs(App Router)

部署地址：https://next-github-pied.vercel.app/


这个是目前官网推荐的架构，能够通过RSCP(React Server Component Payload)提升性能。
而且在学习中，我发现nextjs的功能异常的强大，所以开了新分支来探寻nextjs本身新架构的拓展性。


## 开始

### koa分支KOA方向

1. 开始，先安装依赖，本地运行需要安装redis服务器，然后通过 redis-server
   启动redis服务器

```
   pnpn install
```

2. 启动koa服务，koa会默认启动Nestjs服务。

```
pnpm dev:node 
```

### 纯Nextjs

master 分支

```bash
pnpm dev //  master branch
```
This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## English | [简体中文](./README-zh_CN.md)

## Intro

This project has two versions.

### nextjs(App Router) + KOA + redis  branch: koa

This is the origin version I followed with the resources in the past.

### nextjs(App Router)  branch: master

This is the way we used currently. I hope this can be better.

deploy site: https://next-github-pied.vercel.app/
#### KOA

koa use as the server to connect with redis, it can store

## Getting Started

First, run the development server:

```bash
pnpm dev:node // use KOA in the koa branch
pnpm dev // default in the master![img.png](img.png) branch

```
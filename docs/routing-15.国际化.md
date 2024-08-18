nextjs 允许你配置路由和渲染内容支持多个语言，使你的网站可以翻译成多个语言。
## 术语

- Local 一组语言和格式首选项的标识符。这通常包括用户的首选语言和可能的地理区域
   - en-US：美国的英语
   - nl-WL：荷兰地区的荷兰语
   - nl：荷兰语部分区域
## 路由概述
推荐在浏览器使用用户语言偏好来选择用哪一个locale，改变你的偏好语言会修改传入的 Accept-Language 头。
例如:使用以下依赖，您可以查看传入的请求，根据header、计划支持的语言环境和默认语言环境来决定选择哪个语言环境
```jsx
// middleware.js
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
 
let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['en-US', 'nl-NL', 'nl']
let defaultLocale = 'en-US'
 
match(languages, locales, defaultLocale) // -> 'en-US'
```
路由可以通过子路径(/fr/products)或域(my-site.fr/products)进行国际化。有了这些信息，您现在就可以根据中间件中的区域设置重定向用户了。
```jsx
// middleware.js
import { NextResponse } from "next/server";
 
let locales = ['en-US', 'nl-NL', 'nl']
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request) { ... }
 
export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
```
最后，确保app/中的所有特殊文件都嵌套在app/[lang]下。这使得Next.js路由器能够动态地处理路由中的不同区域设置，并将lang参数转发到每个布局和页面。例如
```jsx
// app/[lang]/page.js
// You now have access to the current locale
// e.g. /en-US/products -> `lang` is "en-US"
export default async function Page({ params: { lang } }) {
  return ...
}
```
根layout也可以嵌套在新文件夹中 app/[lang]/layout.js
## 本土化
支持多语言，通常我们会设置字典
```jsx
// dictionaries/en.json
{
  "products": {
    "cart": "Add to Cart"
  }
}
// dictionaries/nl.json
{
  "products": {
    "cart": "Toevoegen aan Winkelwagen"
  }
}
```
我们可以创建一个getDictionary 方法来载入对于请求的翻译
```jsx
// app/[lang]/dictionaries.js
import 'server-only'
 
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}
 
export const getDictionary = async (locale) => dictionaries[locale]()
```
对于当前选择的语言，可以在layout或page中获取字典
```jsx
// app/[lang]/page.js
import { getDictionary } from './dictionaries'
 
export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang) // en
  return <button>{dict.products.cart}</button> // Add to Cart
}
```
app中默认都是服务端，所以不用担心影响js包的大小，渲染都在html中
## 静态生成
要为给定的区域设置集生成静态路由，我们可以对任何页面或布局使用generateStaticParams。这可以是全局的，例如，在根布局中:
```jsx
// app/[lang]/layout.js
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'de' }]
}
 
export default function Root({ children, params }) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  )
}
```
## 资源

- [Minimal i18n routing and translations](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)
- [next-intl](https://next-intl-docs.vercel.app/docs/next-13)
- [next-international](https://github.com/QuiiBz/next-international)
- [next-i18n-router](https://github.com/i18nexus/next-i18n-router)
- [paraglide-next](https://inlang.com/m/osslbuzt/paraglide-next-i18n)
- [lingui](https://lingui.dev/)

如果你事先不知道确切的段名，希望动态的创建路由，可以使用请求时填充或构建时呈现([prerendered](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params))的动态段。
### 惯例
一个动态路由可以通过[floderName]创建,例如[id],[slug]
动态路由会作为params 属性传递给layout，page，route和[generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)函数
### 例子
```jsx
export default function Page({ params }: { params: { slug: string } }) {
  return <div>My Post: {params.slug}</div>
}
```
通过这个[generateStaticParams()](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#generating-static-params)页面了解怎么生成路由的参数
### 生成静态参数
generateStaticParams 方法可以和动态路由段结合使用来在构建时间中生成，而不是在请求时
```jsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```
generateStaticParams 的优点是可以智能检索数据，通过在方法内使用fetch 请求，请求会被自动记忆，意味着同一个路由段多次的执行，layouts和pages只会构建一次，降低了构建时间。
[generateStaticParamsserver function documentation](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) 查看API
### 全部段
动态路由可以延伸到全段，通过增加..., [...folderName]

| **Route** | **Example URL** | `**params**` |
| --- | --- | --- |
| `app/shop/[...slug]/page.js` | `/shop/a` | `{ slug: ['a'] }` |
| `app/shop/[...slug]/page.js` | `/shop/a/b` | `{ slug: ['a', 'b'] }` |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

### 可选的全段
方式是[[...folderName]]

| **Route** | **Example URL** | `**params**` |
| --- | --- | --- |
| `app/shop/[[...slug]]/page.js` | `/shop` | `{}` |
| `app/shop/[[...slug]]/page.js` | `/shop/a` | `{ slug: ['a'] }` |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b` | `{ slug: ['a', 'b'] }` |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c']}` |

### Typescript 支持
```jsx
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>My Page</h1>
}
```
| **Route** | `**params**`** Type Definition** |
| --- | --- |
| `app/blog/[slug]/page.js` | `{ slug: string }` |
| `app/shop/[...slug]/page.js` | `{ slug: string[] }` |
| `app/shop/[[...slug]]/page.js` | `{ slug?: string[] }` |
| `app/[categoryId]/[itemId]/page.js` | `{categoryId: string, itemId: string}` |

- typescript 插件在将来会自动处理。

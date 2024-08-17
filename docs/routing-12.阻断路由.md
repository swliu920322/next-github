阻断路由允许你在当前路由内加载你应用里的其他路由。录用的典例是有用的当你想展示路由的内容，用户却不用切换到其他页面。
例如：当点击动态消息中的照片，你可以在modal中展示照片，覆盖提要。在例子中，nextjs阻断了/photo/123，屏蔽URL，并且覆盖在/feed上。
![截屏2024-08-17 上午11.03.44.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723863828172-a1b00e5a-e5f7-47aa-b5e9-9f9d09f217ba.png#averageHue=%23f0f0f0&clientId=u80180387-34e2-4&from=drop&height=199&id=uf591f099&originHeight=444&originWidth=1088&originalType=binary&ratio=2&rotation=0&showTitle=false&size=158310&status=done&style=none&taskId=u5ddca697-4626-48ec-b2cc-ec6eb792d50&title=&width=488)
然而，通点击分享URL导航到照片或者刷新页面，整个照片页面应该代替modal渲染，不会发生阻断路由。
![截屏2024-08-17 上午11.07.41.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723864063391-08ac9c16-2e30-4f2b-bd42-527fa915e7c4.png#averageHue=%23f2f2f1&clientId=u80180387-34e2-4&from=drop&height=180&id=u43a17c96&originHeight=432&originWidth=1022&originalType=binary&ratio=2&rotation=0&showTitle=false&size=142227&status=done&style=none&taskId=uc7134dbf-08bb-43cc-a9a6-c1c01a234f6&title=&width=426)
### 习俗
阻断路由可以通过定义(..)，与相对路径是一样的，但是那个是对路由。
你可以使用

- (.) 匹配同一个级别的段
- (..)匹配更高一级的段
- (..)(..)匹配更高两级的段
- (...)匹配app根目录

例如，你可以通过创建(..photo)目录在**feed**段阻断**photo**段
![截屏2024-08-17 上午11.14.13.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723864455365-517f3bf3-a3ef-4c02-b0ed-82c6309bd625.png#averageHue=%23f5f5f5&clientId=u80180387-34e2-4&from=drop&height=321&id=ue18de70b&originHeight=686&originWidth=476&originalType=binary&ratio=2&rotation=0&showTitle=false&size=99756&status=done&style=none&taskId=ub57e3d72-ab29-47a5-94ba-c51a40429d9&title=&width=223)

- (..)基于路由段，而不是文件系统)
### Example例子
#### Modal
阻断路由可以配合平行路由来创建Modal，这个允许你构建modal来解决一些常见问题。

- 使Modal内容可以通过URL分享
- 缓存内容，当页面刷新时，而不是关闭Modal
- 在后退导航时关闭modal,而不是到之前的路由
- 前进时重打开Modal

考虑以下UI，当用户使用客户端从一个gallery打开一个图片modal，或者通过分享的URL直接导航到图片页面。
![截屏2024-08-17 上午11.33.17.png](https://cdn.nlark.com/yuque/0/2024/png/616775/1723865600967-c582dfe4-4352-4085-8ba2-09fb0f89fb86.png#averageHue=%23f6f6f6&clientId=u80180387-34e2-4&from=drop&height=403&id=u59cdfccb&originHeight=702&originWidth=1186&originalType=binary&ratio=2&rotation=0&showTitle=false&size=325030&status=done&style=none&taskId=uebf2a371-4613-455e-b846-cc707493508&title=&width=681)
在以上的例子中，去photo路径上可以使用(..)匹配符因为@modal 是一个插槽而不是一个路由。这个意味着photo路由仅高出一个级别，尽管文件系统高出2个级别
See the [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals) documentation for a step-by-step example, or see our [image gallery example](https://github.com/vercel-labs/nextgram).

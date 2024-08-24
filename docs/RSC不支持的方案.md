## RSC 不支持的方法

- useState
- useEffect
- createContext


- useSearchParams
- usePathname
- useRouter

- server 传递 属性给 client
- antd的 createFromIconfontCN
- 不支持从服务端向客户端传递函数

## RSC 支持的

[//]: # (- useCallback)

### RSC 支持的内容

- cookies 只能在RSC 和 Router handle中
- headers
- props.searchParams
- 动态路由的params
- 当URL的query变更时，RSC会重新渲染，可以进行数据请求
- RSC props包含 params(路由动态) 和 searchParams(query)
- 传递数据给client Component,
- fetch时不会走middleware，所以要额外封装一个处理请求的

### RSC 不支持
- 传递函数给client Component,但可以传递 Server Action

## Layout
layout是一个是共享页面，不会重绘，所以不接受可能改变的东西。
- 不接受searchParams
- 不接受pathname
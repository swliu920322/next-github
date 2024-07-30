import { createFromIconfontCN } from '@ant-design/icons';

// antd IconFont使用方式，
// 先去https://www.iconfont.cn/找到svg，
// 然后点击购物车，右上角购物车添加到项目
// 点击symbol生成在线链接，或者直接下载下来，扎到js文件，然后直接使用就行
const IconFont = createFromIconfontCN({
  scriptUrl: [
    '/static/svg/iconfont.js',
  ],
});
export function UserInfo({userInfo}) {
  return (
    <div className="flex flex-col gap-1">
      <img src={userInfo.avatar_url} className="w-60 rounded-full" alt="user avatar" />
      <span className="text-3xl font-bold">{userInfo.name}</span>
      <span>{userInfo.login}</span>
      <span>{userInfo.bio}</span>
      <span>{userInfo.location}</span>
      <p>
        <IconFont type="icon-email" />
        <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
      </p>
    </div>
  )
}
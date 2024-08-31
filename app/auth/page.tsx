// TODO  改造为页面，处理报错

import { getToken, getUserInfo } from '@/app/auth/page.api';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getInfo } from '@/app/auth/page.action';
// 首页点击 =>  github OAuth
// => /auth 界面 => code请求拿token => token请求拿userInfo
// => redirectBack

export default async function Page({ searchParams }) {
  const code = searchParams.code;
  if (code) {
    const error = await getInfo(code);
    console.log('error', error);
    const url = cookies().get('path')?.value || '/';
    const queryIndex = url.indexOf('?');
    console.log(url, queryIndex);
    let urlClean = url;
    if (queryIndex > 0) {
      urlClean = url.slice(0, queryIndex);
    }
    console.log('urlClean', urlClean);
    if (urlClean === '/auth') {
      urlClean = '/';
    }
    return redirect(error ? urlClean + `?error=${error}` : urlClean);
  }
  return <div className="p-20 flex justify-center">no code</div>;
}

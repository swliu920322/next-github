import { LoginButton, TabSelect } from '@/app/page.components';
import { cookies } from 'next/headers';
import { UserInfo } from '@/components/index/userInfo';

export default function Page() {
  const cookie = cookies();
  const userInfo = JSON.parse(cookie.get('userInfo')?.value) || {};
  if (!userInfo) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <span>亲，你还没有登录哦</span>
          <LoginButton />
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full flex  p-6 gap-32 overflow-hidden">
        <UserInfo userInfo={userInfo} />
        <div className="flex-1 flex flex-col gap-1">
          <TabSelect />
        </div>
      </div>
    );
  }
}

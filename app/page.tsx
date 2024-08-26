import { LoginButton, TabSelect } from '@/app/page.components';
import { cookies } from 'next/headers';
import { UserInfo } from '@/components/index/userInfo';
import { Suspense } from 'react';

export default async function Page() {
  let userInfo = cookies().get('userInfo')?.value;
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
  }
  if (!userInfo) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <span>亲，你还没有登录哦</span>
          <Suspense>
            <LoginButton />
          </Suspense>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full flex  p-6 gap-32 overflow-hidden">
        <UserInfo userInfo={userInfo} />
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <Suspense>
            <TabSelect />
          </Suspense>
        </div>
      </div>
    );
  }
}

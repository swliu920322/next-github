import { Avatar, Popover } from 'antd';
import { cookies } from 'next/headers';
import { Login, Logout } from '@/lib/utils/Auth';
import { Suspense } from 'react';

export async function HeaderAvatar() {
  let userInfo: Record<string, any> = {};
  const userInfoCookie = cookies().get('userInfo')?.value;
  if (userInfoCookie) {
    userInfo = JSON.parse(userInfoCookie);
  }
  if (userInfo) {
    return (
      <Popover content={<Logout />}>
        <Avatar size={48} icon={<img src={userInfo.avatar_url || ''} />} />
      </Popover>
    );
  }
  return (
    <Suspense>
      <Popover content={<Login />}>
        <Avatar size={48} icon={<img src={''} />} />;
      </Popover>
    </Suspense>
  );
}

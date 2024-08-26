import { Avatar, Popover } from 'antd';
import { cookies } from 'next/headers';
import { Login, Logout } from '@/lib/utils/Auth';
import { Suspense } from 'react';
import Image from 'next/image';

export async function HeaderAvatar() {
  let userInfo: Record<string, any> = {};
  const userInfoCookie = cookies().get('userInfo')?.value;
  if (userInfoCookie) {
    userInfo = JSON.parse(userInfoCookie);
  }
  if (userInfo.avatar_url) {
    return (
      <Popover content={<Logout />}>
        <Avatar
          size={48}
          icon={
            <Image width={48} height={48} src={userInfo.avatar_url || ''} alt="" priority={true} />
          }
        />
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

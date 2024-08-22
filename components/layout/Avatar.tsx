import { Avatar, Button, Popover } from 'antd';
// import { HeaderLogin } from '@/lib/utils/Auth';
import { cookies } from 'next/headers';
import { useCallback } from 'react';
import { Logout } from '@/lib/utils/Auth';

export async function HeaderAvatar() {
  let userInfo = cookies().get('userInfo')?.value;
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
  }
  if (userInfo) {
    return (
      <Popover content={<Logout />}>
        <Avatar size={48} icon={<img src={userInfo.avatar_url} />} />
      </Popover>
    );
  }
  return null;
}

import { Avatar, Popover } from 'antd';
import { cookies } from 'next/headers';
import { Login, Logout } from '@/lib/utils/Auth';

export async function HeaderAvatar() {
  let userInfo = cookies().get('userInfo')?.value;
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
  }
  if (userInfo) {
    return (
      <Popover content={<Logout />}>
        <Avatar size={48} icon={<img src={userInfo.avatar_url || ''} />} />
      </Popover>
    );
  }
  return (
    <Popover content={<Login />}>
      <Avatar size={48} icon={<img src={''} />} />;
    </Popover>
  );
}

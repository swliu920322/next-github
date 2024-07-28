'use client';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Popover } from 'antd';
import { useAppSelector } from '@/lib/hooks';
import { logoutFunc, selectUserInfo } from '@/lib/features/user/userSlice';

import { useAppDispatch } from '@/lib/hooks';
import Link from 'next/link';

export function HeaderAvatar() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);
  if (userInfo) {
    const content = (
      <div>
        <Button onClick={() => dispatch(logoutFunc())}>登出</Button>
      </div>
    );
    return (
      <Popover content={content}>
        <Avatar size={48} icon={<img src={userInfo.avatar_url} />} />
      </Popover>
    );
  }
  const loginContent = (
    <Link href={process.env.OAUTH_URL}>点击登录</Link>
  );
  return (
    <Popover content={loginContent}>
      <Avatar size={48} icon={<UserOutlined />} />
    </Popover>
  );
}
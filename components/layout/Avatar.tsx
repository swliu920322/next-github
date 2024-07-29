'use client';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Popover } from 'antd';
import { useAppSelector } from '@/lib/hooks';
import { logoutFunc, selectUserInfo } from '@/lib/features/user/userSlice';
import { useAppDispatch } from '@/lib/hooks';
import { useDealLogin } from '@/lib/utils/Auth';

export function HeaderAvatar() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);
  const { login } = useDealLogin();
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
    <div onClick={login}>点击登录</div>
  );
  return (
    <Popover content={loginContent}>
      <Avatar size={48} icon={<UserOutlined />} />
    </Popover>
  );
}
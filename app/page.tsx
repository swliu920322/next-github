'use client';
import { Button } from 'antd';
import { useAppSelector } from '@/lib/hooks';
import { selectUserInfo } from '@/lib/features/user/userSlice';
import { useDealLogin } from '@/lib/utils/Auth';


export default function Home() {
  const userInfo = useAppSelector(selectUserInfo);
  const { login } = useDealLogin();
  console.log(userInfo);
  
  
  if (!userInfo) {
    return (
      <div className="h-full flex justify-center items-center">
        <Button type="primary" onClick={login}>登录</Button>
      </div>
    );
  } else {
    return (
      <div className="h-full flex justify-center items-center">
        您已经登录
      </div>
    );
  }
  
}

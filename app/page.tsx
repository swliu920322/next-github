"use client"
import { Button } from 'antd';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks';
import { selectUserInfo } from '@/lib/features/user/userSlice';

export default function Home() {
  const userInfo = useAppSelector(selectUserInfo);
  if (!userInfo) {
    return (
      <div className="h-full flex justify-center items-center">
        <Link href={process.env.OAUTH_URL}>
          <Button type="primary">登录</Button>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="h-full flex justify-center items-center">
        您已经登录
      </div>
    )
  }
  
}

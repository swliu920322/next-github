'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'antd';
import { useState } from 'react';
import { PageLoading } from '@/components/PageLoading';

export function useDealLogin() {
  const [loading, setLoading] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = [...searchParams.entries()].reduce((r, c, index) => {
    const [key, value] = c;
    return r + (index === 0 ? '?' : '&') + `${key}=${value}`;
  }, '');
  const router = useRouter();
  const login = async () => {
    setLoading(true);
    await fetch('api/github', {
      method: 'post',
      body: JSON.stringify({ pathName: pathName + query }),
    })
    // setLoading(false);
    router.replace(process.env.OAUTH_URL || '');
  };

  function LoginView() {
    if (loading) {
      return <PageLoading tip="正在处理中..." isFull={true} />;
    }
  }

  return {
    login,
    LoginView,
  };
}

export function Logout() {
  const router = useRouter();

  function logout() {
    fetch('/api/logout').then((r) => {
      router.replace('/');
      router.refresh();
    });
  }

  return (
    <div>
      <Button onClick={logout}>登出</Button>
    </div>
  );
}

export function Login() {
  const { login, LoginView } = useDealLogin();
  return (
    <div>
      <LoginView />
      <Button onClick={login}>登入</Button>
    </div>
  );
}

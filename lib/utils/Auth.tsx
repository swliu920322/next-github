'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'antd';

export function useDealLogin() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const query = [...searchParams.entries()].reduce((r, c, index) => {
    const [key, value] = c;
    return r + (index === 0 ? '?' : '&') + `${key}=${value}`;
  }, '');
  const router = useRouter();
  const login = async () => {
    await fetch('api/github', {
      method: 'post',
      body: JSON.stringify({ pathName: pathName + query }),
    });
    router.replace(process.env.OAUTH_URL || '');
  };
  return {
    login,
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
  const { login } = useDealLogin();
  return (
    <div>
      <Button onClick={login}>登入</Button>
    </div>
  );
}

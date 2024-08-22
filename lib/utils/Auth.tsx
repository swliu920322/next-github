'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'antd';

export function useDealLogin() {
  const pathName = usePathname();
  const login = async () => {
    await fetch('api/github', {
      method: 'post',
      body: JSON.stringify({ pathName }),
    });
    location.href = process.env.OAUTH_URL;
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

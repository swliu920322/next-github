import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

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

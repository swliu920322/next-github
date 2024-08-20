import axios from 'axios';
import { useCallback } from 'react';

export function useDealLogin() {
 
  const login = useCallback(() => {
    let url = `/prepare-auth`;
    const pathname = location.pathname;
    if (pathname) {
      url += `?url=${pathname}`;
    }
    axios.get(url).then((resp) => {
      if (resp.status === 200) {
        location.href = process.env.OAUTH_URL;
      } else {
        console.log('prepare auth failed', resp);
      }
    });
  }, []);
  return {
    login,
  };
}

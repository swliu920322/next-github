import axios from 'axios';
import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

// import { cookies } from 'next/headers';

export function useDealLogin() {
  const pathName = usePathname();
  // console.log(cookies().getAll());
  const login = useCallback(async () => {
    console.log(pathName);
    const res = await fetch('api/github', {
      method: 'post',
      body: JSON.stringify({
        pathName,
      }),
    });
    console.log('res', res);
    // ctx.session.urlBeforeOAuth = url
    // let url = `/prepare-auth`;
    // const pathname = location.pathname;
    // // if (pathname) {
    // //   url += `?url=${pathname}`;
    // // }
    // axios.get(url).then((resp) => {
    //   if (resp.status === 200) {
    //     location.href = process.env.OAUTH_URL;
    //   } else {
    //     console.log('prepare auth failed', resp);
    //   }
    // });
  }, []);
  return {
    login,
  };
}

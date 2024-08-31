'use server';

import { getToken, getUserInfo } from '@/app/auth/page.api';
import { headers } from 'next/headers';

export async function getInfo(code: string) {
 
  return getToken(code)
    .then((result) => {
      console.log('after getToken', result);
      if (result) {
        if (result.error) {
          throw new Error('error_description:');
        } else {
          console.log('searchParams', result);
          fetch(headers().get('referer') +'/api/cookie', {
            method: 'POST',
            body: JSON.stringify({ key: 'githubAuth', value: JSON.stringify(result) }),
          });
          const { access_token, token_type } = result;
          return getUserInfo(token_type, access_token);
        }
      }
    })
    .then((userInfo) => {
      console.log('userInfo', userInfo);
      // cookies().set('userInfo', JSON.stringify(userInfo));
      fetch(headers().get('referer') +'/api/cookie', {
        method: 'POST',
        body: JSON.stringify({ key: 'userInfo', value: JSON.stringify(userInfo) }),
      });
      // createCookie('userInfo', JSON.stringify(userInfo));
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
}

import { config } from '@/config.mjs';
import { request } from '@/lib/request';

const {
  github: { client_id, client_secret, gitAccess, gitUser },
} = config;

export function getToken(code: string) {
  return request(gitAccess, {
    method: 'POST',
    body: JSON.stringify({ client_id, client_secret, code }),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).catch((err) => {
    console.log('errUserToken', err);
    throw new Error(err.toString());
  });
}

// 解析code
// 向github请求获得token
// 继续请求获得用户信息
export function getUserInfo(token_type: string, access_token: string) {
  return request(gitUser, {
    method: 'POST',
    headers: { Authorization: `${token_type} ${access_token}` },
  }).catch((err) => {
    console.log('errUserInfo', err);
    throw new Error('getUserInfoFailed');
  });
}

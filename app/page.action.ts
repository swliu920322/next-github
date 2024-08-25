'use server';

import { request } from '@/lib/request';

export async function getList() {
  const apiList = [request('/github/user/repos'), request('/github/user/starred')];
  const listAll = await Promise.allSettled(apiList);
  const r = listAll.map((i) => (Array.isArray(i.value) ? i.value : []));
  return {
    repos: r[0],
    stars: r[1],
  };
}

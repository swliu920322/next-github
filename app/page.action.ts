'use sever';

export async function getList() {
  const apiList = [fetch('/github/user/repos').then((r) => r.json()), fetch('/github/user/starred').then((r) => r.json())];
  const listAll = await Promise.allSettled(apiList);
  const r = listAll.map((i) => (Array.isArray(i.value) ? i.value : []));
  return {
    repos: r[0],
    stars: r[1],
  };
}

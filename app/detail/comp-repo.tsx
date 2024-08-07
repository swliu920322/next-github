'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';

export function CompRepo() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const name = searchParams.get('name');
  const [repoInfo, setRepoInfo] = useState({
    owner: {},
  });
  useEffect(() => {
    request({ url: `/repos/${owner}/${name}` }).then((resp) => {
      setRepoInfo(resp.data);
    });
  }, [owner, name]);
  const isReadme = useMemo(() => {
    return pathname === '/detail';
  }, [pathname]);
  return (
    <div className="p-4">
      <div className="flex items-center">
        <img className="rounded-full w-10" src={repoInfo?.owner?.avatar_url || ''} />
        <span className="ml-2">{repoInfo.full_name}</span>
        <span className="ml-2 p-0.5 px-2 rounded-2xl border">{repoInfo.private ? 'private' : 'public'}</span>
        <div className="ml-9">
          {repoInfo.stargazers_count}
          <StarFilled className="ml-2" />
        </div>
      </div>
      <div className="mt-2 mb-2 truncate">{repoInfo.description}</div>
      <div className="flex gap-2">
        <Link className={`p-2 ${isReadme ? 'border-b border-blue-500' : 'text-gray-400'}`} href={`/detail?owner=${owner}&name=${name}`}>
          readme
        </Link>
        <Link className={`p-2 ${!isReadme ? 'border-b border-blue-500' : 'text-gray-400'}`} href={`/detail/issues?owner=${owner}&name=${name}`}>
          Issues
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';

export function CompRepo() {
  const searchParams = useSearchParams();

  const [repoInfo, setRepoInfo] = useState({
    owner: {},
  });
  useEffect(() => {
    const owner = searchParams.get('owner');
    const name = searchParams.get('name');
    request({ url: `/repos/${owner}/${name}` }).then((resp) => {
      setRepoInfo(resp.data);
    });
  }, [searchParams]);
  return (
    <div>
      <div className="flex">
        <img className="rounded-full w-10" src={repoInfo.owner?.avatar_url || ''} />
        
      </div>
    </div>
  );
}

'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import useSWR from 'swr';
import { PageLoading } from '@/components/PageLoading';

export function CompRepo({ getInfo }: { getInfo: Function }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const name = searchParams.get('name');
  const { data: repoInfo, isLoading } = useSWR(`${owner}/${name}`, () =>
    getInfo(`/github/repos/${owner}/${name}`)
  );
  const isReadme = useMemo(() => pathname === '/detail', [pathname]);
  if (isLoading) {
    return (
      <div className="w-full" style={{ height: 150 }}>
        <PageLoading />
      </div>
    );
  }
  return (
    <div className="p-4">
      <div className="flex items-center">
        <img className="rounded-full w-10" src={repoInfo?.owner?.avatar_url || ''} />
        <span className="ml-2">{repoInfo.full_name}</span>
        <span className="ml-2 p-0.5 px-2 rounded-2xl border">
          {repoInfo.private ? 'private' : 'public'}
        </span>
        <div className="ml-9">
          {repoInfo.stargazers_count}
          <StarFilled className="ml-2" />
        </div>
      </div>
      <div className="mt-2 mb-2 truncate">{repoInfo.description}</div>
      <div className="flex gap-2">
        <Link
          className={`p-2 ${isReadme ? 'border-b border-blue-500' : 'text-gray-400'}`}
          href={`/detail?owner=${owner}&name=${name}`}
        >
          readme
        </Link>
        <Link
          className={`p-2 ${!isReadme ? 'border-b border-blue-500' : 'text-gray-400'}`}
          href={`/detail/issues?owner=${owner}&name=${name}`}
        >
          Issues
        </Link>
      </div>
    </div>
  );
}

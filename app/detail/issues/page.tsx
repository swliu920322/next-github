import { request } from '@/app/lib/request';
import { Suspense } from 'react';
import { PageLoading } from '@/components/PageLoading';
import { IssueItem } from '@/app/detail/issues/page.components';

async function GetIssues({ searchParams }) {
  const owner = searchParams.owner;
  const name = searchParams.name;
  const data = await request(`/github/repos/${owner}/${name}/issues`);
  return (
    <div className="flex flex-col gap-3 p-4 pt-0">
      {data.map((issue) => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

export default function Page({ searchParams }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full">
          <PageLoading />
        </div>
      }
    >
      <GetIssues searchParams={searchParams} />
    </Suspense>
  );
}

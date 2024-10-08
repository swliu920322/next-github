import { request } from '@/lib/request';
import { Suspense } from 'react';
import { PageLoading } from '@/components/PageLoading';
import { IssueItem } from '@/app/detail/issues/page.components';

async function GetIssues({ searchParams }: { searchParams: Record<string, any> }) {
  const owner = searchParams.owner;
  const name = searchParams.name;
  const data = await request(`/github/repos/${owner}/${name}/issues`);
  return (
    <div className="flex flex-col gap-3 p-4 pt-0">
      {data.map((issue: Record<string, any>) => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

export default function Page({ searchParams }: { searchParams: Record<string, any> }) {
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

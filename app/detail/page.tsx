import { Suspense } from 'react';
import { request } from '@/lib/request';
import { PageLoading } from '@/components/PageLoading';
import MarkdownContent from '@/components/MarkdownContent';

async function MyContent({ searchParams }: { searchParams: Record<string, any> }) {
  const owner = searchParams.owner;
  const name = searchParams.name;
  const data = await request(`/github/repos/${owner}/${name}/readme`);
  const content = atob(data.content);
  return <MarkdownContent content={content} />;
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
      <MyContent searchParams={searchParams} />
    </Suspense>
  );
}

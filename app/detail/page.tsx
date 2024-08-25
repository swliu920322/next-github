import { Suspense } from 'react';
import { request } from '@/app/lib/request';
import { PageLoading } from '@/components/PageLoading';
import MarkdownContent from '@/components/MarkdownContent';

export async function MyContent({ searchParams }) {
  if (searchParams) {
    const owner = searchParams.owner;
    const name = searchParams.name;
    const data = await request(`/github/repos/${owner}/${name}/readme`);
    const content = atob(data.content);
    return <MarkdownContent content={content} />;
  }
}

export default function Page({ searchParams }) {
  function Loading() {
    return (
      <div className="w-full h-full">
        <PageLoading />
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <MyContent searchParams={searchParams} />
    </Suspense>
  );
}

import { request } from '@/app/lib/request';
import { getQueryStr } from '@/lib/utils/dealPathname';
import { CategoryLanguage, CategoryOrder, PageComponent } from '@/app/search/page.component';
import { RepoItem } from '@/components/index/RepoItem';
import { Suspense } from 'react';
import { Spin } from 'antd';

const languages = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust'];
const SORT_TYPES = [
  { name: 'Best Match' },
  { name: 'Most Stars', value: 'stars', order: 'desc' },
  { name: 'Fewest Stars', value: 'stars', order: 'asc' },
  { name: 'Most forks', value: 'forks', order: 'desc' },
  { name: 'Fewest forks', value: 'forks', order: 'asc' },
];

function getSearchContent(searchParams) {
  const queryStr = getQueryStr(searchParams, true);
  return request(`/github/search/repositories${queryStr}`);
}

export default async function Search({ searchParams }) {
  const listData = await getSearchContent(searchParams);

  return (
    <div className="flex p-4 overflow-hidden h-full">
      <div className="flex w-40 flex-col overflow-auto h-full">
        <CategoryLanguage dataSource={languages} searchParams={searchParams} />
        <CategoryOrder dataSource={SORT_TYPES} searchParams={searchParams} />
      </div>
      <div className="flex-1 flex flex-col ml-4 overflow-hidden h-full relative">
        <Suspense fallback={<Spin />}>
          <div className="flex flex-1 flex-col gap-3 border-slate-500 border-t overflow-auto">
            {listData?.items?.map((item) => <RepoItem key={item.id} item={item} />)}
          </div>
          <div className="mt-2 self-center">
            <PageComponent searchParams={searchParams} total={listData?.total_count || 0} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

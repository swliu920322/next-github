import { request } from '@/lib/request';
import { getQueryStr } from '@/lib/utils/dealPathname';
import { CategoryLanguage, CategoryOrder, DataPageComponent } from '@/app/search/page.component';

const languages = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust'];
const SORT_TYPES = [
  { name: 'Best Match' },
  { name: 'Most Stars', value: 'stars', order: 'desc' },
  { name: 'Fewest Stars', value: 'stars', order: 'asc' },
  { name: 'Most forks', value: 'forks', order: 'desc' },
  { name: 'Fewest forks', value: 'forks', order: 'asc' },
];

async function getSearchContent(searchParams: Record<string, any>) {
  'use server';
  const queryStr = getQueryStr(searchParams, true);
  return await request(`/github/search/repositories${queryStr}`);
}

export default async function Search({ searchParams }: {searchParams: Record<string, any>}) {
  return (
    <div className="flex p-4 overflow-hidden h-full">
      <div className="flex w-40 flex-col overflow-auto h-full">
        <CategoryLanguage dataSource={languages} searchParams={searchParams} />
        <CategoryOrder dataSource={SORT_TYPES} searchParams={searchParams} />
      </div>
      <div className="flex-1 flex flex-col ml-4 overflow-hidden h-full relative">
        <DataPageComponent getSearchContent={getSearchContent} searchParams={searchParams} />
      </div>
    </div>
  );
}

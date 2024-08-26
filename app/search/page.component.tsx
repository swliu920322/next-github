'use client';

import { List, Pagination } from 'antd';
import { getQueryStr } from '@/lib/utils/dealPathname';
import Item from 'antd/lib/list/Item';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { RepoItem } from '@/components/index/RepoItem';
import useSWR from 'swr';
import { PageLoading } from '@/components/PageLoading';

export function DataPageComponent({ searchParams, getSearchContent }: any) {
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { data, isLoading } = useSWR(JSON.stringify(searchParams), () =>
    getSearchContent(searchParams).then((r: Record<string, any>) => {
      setTotal(Math.min(r?.total_count || 0, 1000));
      return r;
    }),
  );
  
  const pageChange = useCallback((page: Number, per_page = 10) => {
    const queryStr = getQueryStr({ ...searchParams, page, per_page });
    router.push(`/search${queryStr}`);
  }, []);
  
  return (
    <>
      {isLoading ? (
        <PageLoading />
      ) : (
        <div className="flex flex-1 flex-col gap-3 border-slate-500 border-t overflow-auto">
          {data?.items?.map((item: Record<string, any>) => <RepoItem key={item.id} item={item} />)}
        </div>
      )}
      <div className="mt-2 self-center">
        <Pagination
          pageSize={Number(searchParams?.per_page) || 10}
          current={Number(searchParams?.page) || 1}
          total={total}
          onChange={pageChange}
        />
      </div>
    </>
  );
}

export function CategoryLanguage({ dataSource, searchParams = {} }: any) {
  const router = useRouter();
  const language = useMemo(() => searchParams?.language, [searchParams]);
  
  function handleLanguage(item: string) {
    const queryStr = getQueryStr({ ...searchParams, language: item });
    router.push(`/search${queryStr}`);
  }
  
  return (
    <List
      header={<span>语言</span>}
      bordered
      dataSource={dataSource}
      renderItem={(item: string) => (
        <Item
          className={`cursor-pointer ${item === language && 'border-l-2 border-blue-400 active-item'}`}
          onClick={() => item !== language && handleLanguage(item)}
        >
          {item}
        </Item>
      )}
    />
  );
}

export function CategoryOrder({ dataSource, searchParams }: any) {
  const router = useRouter();
  
  function handleOrder(item: Record<string, any>) {
    const queryStr = getQueryStr({ ...searchParams, sort: item.value, order: item.order });
    router.push(`/search${queryStr}`);
  }
  
  function dealSort(item: Record<string, any>) {
    const { sort, order } = searchParams;
    if (item.value) {
      return item.value === sort && item.order === order;
    }
    return !item.value && !order;
  }
  
  return (
    <List
      header={<span>排序</span>}
      bordered
      dataSource={dataSource}
      renderItem={(item: Record<string, any>) => (
        <Item
          className={`cursor-pointer ${dealSort(item) && 'border-l-2 border-blue-400 active-item'}`}
          onClick={() => !dealSort(item) && handleOrder(item)}
        >
          {item.name}
        </Item>
      )}
    />
  );
}

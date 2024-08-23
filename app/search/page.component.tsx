'use client';
import { List, Pagination } from 'antd';
import { getQueryStr } from '@/lib/utils/dealPathname';
import Item from 'antd/lib/list/Item';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { RepoItem } from '@/components/index/RepoItem';

export function DataPageComponent({ searchParams, getSearchContent }) {
  const router = useRouter();
  const [listData, setListData] = useState({});
  useEffect(() => {
    getSearchContent(searchParams).then((r) => {
      setListData(r);
    });
  }, [getSearchContent, searchParams]);

  function pageChange(page: Number, per_page: Number = 10) {
    const queryStr = getQueryStr({ ...searchParams, page, per_page });
    router.push(`/search${queryStr}`);
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-3 border-slate-500 border-t overflow-auto">
        {listData?.items?.map((item) => <RepoItem key={item.id} item={item} />)}
      </div>
      <div className="mt-2 self-center">
        <Pagination
          pageSize={Number(searchParams?.per_page) || 10}
          current={Number(searchParams?.page) || 1}
          total={Math.min(listData?.total_count || 0, 1000)}
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
      renderItem={(item) => (
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

export function CategoryOrder({ dataSource, searchParams }) {
  const router = useRouter();

  function handleOrder(item) {
    const queryStr = getQueryStr({ ...searchParams, sort: item.value, order: item.order });
    router.push(`/search${queryStr}`);
  }

  function dealSort(item) {
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
      renderItem={(item) => (
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

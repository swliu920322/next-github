'use client';
import { RepoItem } from '@/components/index/RepoItem';
import { List, Pagination } from 'antd';
import { useState } from 'react';
import { getQueryStr } from '@/lib/utils/dealPathname';
import { router } from 'next/client';
import Item from 'antd/lib/list/Item';
import { useSearchParams } from 'next/navigation';

export function RepoList({ searchParams }) {
  console.log(JSON.stringify(searchParams));
  const [result, setRes] = useState({ items: [] });

  function pageChange(page: Number, per_page: Number = 10) {
    const queryStr = getQueryStr({ ...searchParams, page, per_page });
    router.push(`/search${queryStr}`);
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-3 border-slate-500 border-t overflow-auto">
        {result?.items?.map((item) => <RepoItem key={item.id} item={item} />)}
      </div>
      <div className="mt-2 self-center">
        {/* 修复github最大返回数量大于1000的问题*/}
        <Pagination
          pageSize={Number(searchParams?.per_page) || 10}
          current={Number(searchParams?.page) || 1}
          total={Math.min(result?.total_count || 0, 1000)}
          onChange={pageChange}
        />
      </div>
    </>
  );
}

export function Category({
  header,
  dataSource,
  value = (i) => i,
  highlight = (i: Object) => true,
  dealFunc,
}) {
  const searchParams = useSearchParams();
  return (
    <List
      header={header}
      bordered
      dataSource={dataSource}
      renderItem={(item, index) => (
        <Item
          key={index}
          className={`cursor-pointer ${highlight(item) && 'border-l-2 border-blue-400 active-item'}`}
          onClick={() => !highlight(item) && dealFunc(item)}
        >
          {value(item)}
        </Item>
      )}
    />
  );
}

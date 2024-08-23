'use client';
import { List, Pagination } from 'antd';
import { getQueryStr } from '@/lib/utils/dealPathname';
import Item from 'antd/lib/list/Item';
import { useRouter, useSearchParams } from 'next/navigation';

export function PageComponent({ searchParams, total }) {
  const router = useRouter();

  function pageChange(page: Number, per_page: Number = 10) {
    const queryStr = getQueryStr({ ...searchParams, page, per_page });
    router.push(`/search${queryStr}`);
  }

  return (
    <Pagination
      pageSize={Number(searchParams?.per_page) || 10}
      current={Number(searchParams?.page) || 1}
      total={Math.min(total, 1000)}
      onChange={pageChange}
    />
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

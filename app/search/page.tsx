'use client';
import { useEffect, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';
import { List, Spin } from 'antd';
import Item from 'antd/lib/list/Item';
import { RepoItem } from '@/components/index/RepoItem';
import { useRouter } from 'next/navigation';
import { getQueryStr } from '@/lib/utils/dealPathname';


// 查询接口，需要处理一些字段
function getData({ query, language, sort, order, page }) {
  const queryStr = getQueryStr({ query, language, sort, order, page }, true);
  return request({ url: `/search/repositories${queryStr}` }).then(res => {
    return res?.data || [];
  });
}

const languages = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust'];
const SORT_TYPES = [
  { name: 'Best Match' },
  { name: 'Most Stars', value: 'stars', order: 'desc' },
  { name: 'Fewest Stars', value: 'stars', order: 'asc' },
  { name: 'Most forks', value: 'forks', order: 'desc' },
  { name: 'Fewest forks', value: 'forks', order: 'asc' },
];
export default function Search({ searchParams }) {
  const [result, setRes] = useState({ items: [] });
  const router = useRouter();
  useEffect(() => {
    getData(searchParams).then(res => {
      setRes(res);
    });
  }, [searchParams]);
  
  function handleLanguage(item) {
    const queryStr = getQueryStr({ ...searchParams, language: item });
    router.push(`/search${queryStr}`);
    setRes({ items: [] });
  }
  
  function handleOrder(item) {
    const queryStr = getQueryStr({ ...searchParams, sort: item.value, order: item.order });
    router.push(`/search${queryStr}`);
    setRes({ items: [] });
  }
  
  function dealSort(item) {
    const { sort, order } = searchParams;
    if (item.value) {
      return item.value === sort && item.order === order;
    }
    return !item.value && !sort;
  }
  
  return (
    <div className="flex p-4 overflow-hidden h-full">
      <div className="flex w-40 flex-col overflow-auto h-full">
        <List
          header={<span>语言</span>}
          bordered
          dataSource={languages}
          renderItem={(item) =>
            <Item
              className={`cursor-pointer ${item === searchParams.language && 'border-l-2 border-blue-400 active-item'}`}
              onClick={() => item !== searchParams.language && handleLanguage(item)}>
              {item}
            </Item>
          }
        />
        <List
          header={<span>排序</span>}
          bordered
          dataSource={SORT_TYPES}
          renderItem={(item) =>
            <Item className={`cursor-pointer ${dealSort(item) && 'border-l-2 border-blue-400 active-item'}`}
                  onClick={() => !dealSort(item) && handleOrder(item)}>
              {item.name}
            </Item>
          }
        />
      </div>
      <div className="flex-1 ml-4 overflow-hidden h-full">
        <div className="flex h-full flex-col gap-3 border-slate-500 border-t overflow-auto">
          {
            result?.items ?
              result?.items?.map(item => <RepoItem key={item.id} item={item} />) :
              <div className="w-full h-full flex justify-center items-center">
                <Spin />
              </div>
          }
        </div>
      </div>
    </div>
  );
}
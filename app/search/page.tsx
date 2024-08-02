'use client';
import { useEffect, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';
import { List } from 'antd';
import Item from 'antd/lib/list/Item';
import { RepoItem } from '@/components/index/RepoItem';
import { useRouter } from 'next/navigation';

//  获取路由接口
function getQueryStr(item: Record<string, string>, replaceFunc = i => i) {
  console.log('getQueryStr', item);
  const { query, language, sort, order = 'desc', page } = item;
  let queryStr = '';
  queryStr += `?${replaceFunc('q')}=${query}`;
  if (language) queryStr += `+language:${language}`;
  if (sort) queryStr += `&sort=${sort}`;
  if (order) queryStr += `&order=${order}`;
  if (page) queryStr += `&page=${page}`;
  return queryStr;
}

// 查询接口，需要处理一些字段
function getData({ query, language, sort, order = 'desc', page }) {
  const queryStr = getQueryStr({ query, language, sort, order, page });
  console.log('queryStr', queryStr);
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
  
  const [result, setRes] = useState({});
  const router = useRouter();
  useEffect(() => {
    console.log(searchParams, 'useEffect');
    getData(searchParams).then(res => {
      setRes(res);
    });
  }, [searchParams]);
  
  function handleLanguage(item) {
    console.log('handleLanguage', item);
    const { query, ...extra } = searchParams;
    const queryStr = getQueryStr({ ...extra, query, language: item }, () => 'query');
    router.push(`/search${queryStr}`);
  }
  
  function handleOrder(item) {
    console.log('handleOrder', item);
    const { query, ...extra } = searchParams;
    const queryStr = getQueryStr({ ...extra, query, sort: item.value, order: item.order });
    router.push(`/search${queryStr}`);
  }
  
  return (
    <div className="flex p-4 overflow-hidden">
      <div className="flex w-40 flex-col">
        <List
          header={<span>语言</span>}
          bordered
          dataSource={languages}
          renderItem={(item) =>
            <Item className="cursor-pointer" onClick={() => handleLanguage(item)}>
              {item}
            </Item>
          }
        />
        <List
          header={<span>排序</span>}
          bordered
          dataSource={SORT_TYPES}
          renderItem={(item) =>
            <Item className="cursor-pointer" onClick={() => handleOrder(item)}>
              {item.name}
            </Item>
          }
        />
      </div>
      <div className="flex-1 ml-4 overflow-hidden">
        <div className="flex h-full flex-col gap-3 border-slate-500 border-t overflow-auto">
          {result?.items?.map(item => <RepoItem key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
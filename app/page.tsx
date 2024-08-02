'use client';
import { Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useAppSelector } from '@/lib/hooks';
import { selectUserInfo } from '@/lib/features/user/userSlice';
import { useDealLogin } from '@/lib/utils/Auth';
import { useCallback, useEffect, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';
import { RepoItem } from '@/components/index/RepoItem';
import { UserInfo } from '@/components/index/userInfo';
import { useSearchParams, useRouter } from 'next/navigation';
// TODO 做服务端缓存，暂时不知道怎么做，这个只是client的
export default function Home() {
  const userInfo = useAppSelector(selectUserInfo);
  const router = useRouter();
  const [repos, setRepos] = useState([]);
  const [starred, setStarred] = useState([]);
  const [activeKey, setActiveKey] = useState('0');
  const { login } = useDealLogin();
  const getRepos = useCallback(() => {
    request({ url: '/user/repos' }).then(resp => setRepos(resp.data));
  }, []);
  const getStars = useCallback(() => {
    request({ url: '/user/starred' }).then(resp => setStarred(resp.data));
  }, []);
  
  const searchParams = useSearchParams();
  useEffect(() => {
    getRepos();
    getStars();
    const key = searchParams.get('query');
    key && setActiveKey(key);
  }, []);
  
  const onChange = useCallback((key) => {
    setActiveKey(key)
    router.push(`/?query=${key}`);
  }, []);
  
  const items: TabsProps['items'] = [
    { label: '你的仓库', data: repos },
    { label: '你关注的仓库', data: starred },
  ].map((i, index) => {
    return {
      key: index + '',
      label: i.label,
      children: i.data?.length ? (
        <div className="flex h-full flex-col gap-3 border-slate-500 border-t overflow-auto">
          {i.data.map(item => <RepoItem key={item.id} item={item} />)}
        </div>
      ): null,
    };
  });
  if (!userInfo) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <span>亲，你还没有登录哦</span>
          <Button type="primary" onClick={login}>登录</Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full flex  p-6 gap-32 overflow-hidden">
        <UserInfo userInfo={userInfo} />
        <div className="flex-1 flex flex-col gap-1">
          <Tabs activeKey={activeKey} onChange={onChange} className="h-full" items={items} />
        </div>
      </div>
    );
  }
}

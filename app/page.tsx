'use client';
import { Button } from 'antd';
import { useAppSelector } from '@/lib/hooks';
import { selectUserInfo } from '@/lib/features/user/userSlice';
import { useDealLogin } from '@/lib/utils/Auth';
import { useCallback, useEffect, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';
import { RepoItem } from '@/components/index/RepoItem';
import { UserInfo } from '@/components/index/userInfo';

export default function Home() {
  const userInfo = useAppSelector(selectUserInfo);
  const [repos, setRepos] = useState([]);
  const [starred, setStarred] = useState([]);
  const { login } = useDealLogin();
  const getRepos = useCallback(() => {
    request({ url: '/user/repos' })
      .then(resp => {
        setRepos(resp.data);
      });
  }, []);
  const getStars = useCallback(() => {
    request({ url: '/user/starred' })
      .then(resp => {
        setStarred(resp.data);
      });
  }, []);
  
  useEffect(() => {
    getRepos();
    getStars();
  }, []);
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
          <span>user Repo</span>
          <div className="flex flex-col gap-3 border-slate-500 border-t overflow-auto">
            {repos.map(item => <RepoItem key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    );
  }
  
}

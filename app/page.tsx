'use client';
import { Button } from 'antd';
import { useAppSelector } from '@/lib/hooks';
import { selectUserInfo } from '@/lib/features/user/userSlice';
import { useDealLogin } from '@/lib/utils/Auth';
import { useCallback, useEffect, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';


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
        <Button type="primary" onClick={login}>登录</Button>
      </div>
    );
  } else {
    return (
      <div className="h-full flex justify-center items-center">
        您已经登录
      </div>
    );
  }
  
}

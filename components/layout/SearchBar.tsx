'use client';
import { useCallback, useEffect, useState } from 'react';
import Search from 'antd/lib/input/Search';
import axios from 'axios';
import { useAppDispatch } from '@/lib/hooks';
import { initial } from '@/lib/features/user/userSlice';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchContext, setSearchContext] = useState('');
  const onChange = useCallback((e) => {
    setSearchContext(e.target.value);
  }, []);
  const onSearch = useCallback(() => {
    router.push(`/search?query=${searchContext}`);
  }, [searchContext]);
  
  function getUserInfo() {
    axios.get('/api/user/userInfo')
      .then(resp => {
        dispatch(initial(resp.data));
      }).catch(resp => {
        dispatch(initial());
      },
    );
  }
  
  const searchParams = useSearchParams();
  function getSearchContent() {
    const content = searchParams.get('query');
    if(content) {
      setSearchContext(content)
    }
  }
  
  useEffect(() => {
    getUserInfo();
    getSearchContent();
  }, []);
  
  return (
    <Search placeholder="搜索仓库" value={searchContext} onSearch={onSearch} onChange={onChange} />
  );
}
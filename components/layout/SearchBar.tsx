'use client';
import { useCallback, useEffect, useState } from 'react';
import Search from 'antd/lib/input/Search';
import axios from 'axios';
import { useAppDispatch } from '@/lib/hooks';
import { initial } from '@/lib/features/user/userSlice';

export function SearchBar() {
  const dispatch = useAppDispatch();
  
  const [searchContext, setSearchContext] = useState('');
  const onChange = useCallback((e) => {
    setSearchContext(e.target.value);
  }, []);
  const onSearch = useCallback(() => {
    console.log('onSearch', searchContext);
  }, [searchContext]);
  
  useEffect(() => {
    axios.get('/api/user/userInfo')
      .then(resp => {
        dispatch(initial(resp.data));
      });
  }, []);
  
  return (
    <Search placeholder="搜索仓库" value={searchContext} onSearch={onSearch} onChange={onChange} />
  );
}
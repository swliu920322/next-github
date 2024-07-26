'use client';
import { useCallback, useState } from 'react';
import Search from 'antd/lib/input/Search';

export function SearchBar() {
  const [searchContext, setSearchContext] = useState('');
  const onChange = useCallback((e) => {
    setSearchContext(e.target.value);
  }, []);
  const onSearch = useCallback(() => {
    console.log('onSearch', searchContext);
  }, [searchContext]);
  return (
    <Search placeholder="搜索仓库" value={searchContext} onSearch={onSearch} onChange={onChange} />
  );
}
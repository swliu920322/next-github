'use client';
import { useCallback, useEffect, useState } from 'react';
import Search from 'antd/lib/input/Search';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const [searchContext, setSearchContext] = useState('');
  const onChange = useCallback((e) => {
    setSearchContext(e.target.value);
  }, []);
  const onSearch = useCallback(() => {
    router.push(`/search?query=${searchContext}`);
  }, [router, searchContext]);

  const searchParams = useSearchParams();

  const getSearchContent = useCallback(() => {
    const content = searchParams.get('query');
    if (content) {
      setSearchContext(content);
    }
  }, [searchParams]);

  useEffect(() => {
    getSearchContent();
  }, [getSearchContent]);

  return <Search placeholder="搜索仓库" value={searchContext} onSearch={onSearch} onChange={onChange} />;
}

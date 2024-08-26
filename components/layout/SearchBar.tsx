'use client';
import { useCallback, useState } from 'react';
import Search from 'antd/lib/input/Search';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchContext, setSearchContext] = useState(searchParams.get('query') || '');
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchContext(e.target.value);
  }, []);
  const onSearch = useCallback(() => {
    router.push(`/search?query=${searchContext}`);
  }, [router, searchContext]);

  return (
    <Search placeholder="搜索仓库" value={searchContext} onSearch={onSearch} onChange={onChange} />
  );
}

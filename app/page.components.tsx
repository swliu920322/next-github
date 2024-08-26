'use client';
import { Button, Tabs, TabsProps } from 'antd';
import { useDealLogin } from '@/lib/utils/Auth';
import { RepoItem } from '@/components/index/RepoItem';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getList } from '@/app/page.action';
import useSWR from 'swr';
import { PageLoading } from '@/components/PageLoading';

export function LoginButton() {
  const { login } = useDealLogin();
  return (
    <Button type="primary" onClick={login}>
      登录
    </Button>
  );
}

export function TabSelect() {
  const [activeKey, setActiveKey] = useState('0');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading } = useSWR('getUserRepo', getList);
  useEffect(() => {
    const key = searchParams.get('tab');
    setActiveKey(key || '0');
  }, [searchParams]);

  const onChange = useCallback((key: string) => {
    setActiveKey(key);
    router.push(`/?tab=${key}`);
  }, []);

  const items: TabsProps['items'] = [
    { label: '你的仓库', data: data?.repos || [] },
    { label: '你关注的仓库', data: data?.stars || [] },
  ].map((i, index) => {
    return {
      key: index + '',
      label: i.label,
      children: i.data?.length ? (
        <div className="flex h-full flex-col gap-3 border-slate-500 border-t overflow-auto">
          {i.data.map((item: Record<string, any>) => (
            <RepoItem key={item.id} item={item} />
          ))}
        </div>
      ) : null,
    };
  });
  if (isLoading) {
    return <PageLoading />;
  }
  return <Tabs activeKey={activeKey} onChange={onChange} className="h-full" items={items} />;
}

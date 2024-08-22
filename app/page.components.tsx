'use client';
import { Button, Tabs } from 'antd';
import type TabsProps from 'antd';
import { useDealLogin } from '@/lib/utils/Auth';
import { RepoItem } from '@/components/index/RepoItem';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginButton(props) {
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

  useEffect(() => {
    const key = searchParams.get('tab');
    setActiveKey(key || '0');
  }, []);

  const onChange = useCallback((key) => {
    setActiveKey(key);
    router.push(`/?tab=${key}`);
  }, []);

  const items: TabsProps['items'] = [
    { label: '你的仓库', data: [] },
    { label: '你关注的仓库', data: [] },
  ].map((i, index) => {
    return {
      key: index + '',
      label: i.label,
      children: i.data?.length ? (
        <div className="flex h-full flex-col gap-3 border-slate-500 border-t overflow-auto">
          {i.data.map((item) => (
            <RepoItem key={item.id} item={item} />
          ))}
        </div>
      ) : null,
    };
  });
  return <Tabs activeKey={activeKey} onChange={onChange} className="h-full" items={items} />;
}

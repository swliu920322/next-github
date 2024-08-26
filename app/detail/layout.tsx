import { CompRepo } from './comp-repo';
import { request } from '@/lib/request';
import { Suspense } from 'react';

async function getInfo(url: string) {
  'use server';
  return request(url);
}

export default function DetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <Suspense>
        <CompRepo getInfo={getInfo} />
      </Suspense>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

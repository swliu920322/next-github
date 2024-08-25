import { CompRepo } from './comp-repo';
import { request } from '@/app/lib/request';

async function getInfo(url) {
  'use server';
  return request(url);
}

export default function DetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <CompRepo getInfo={getInfo} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

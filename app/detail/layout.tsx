import { CompRepo } from './comp-repo';
import { StarFilled } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import { request } from '@/app/lib/request';

// import Link from 'next/link';

async function getInfo(url) {
  'use server';
  return request(url);
}

export default function DetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col overflow-hidden">
      <CompRepo getInfo={getInfo} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

'use client';
import { Spin } from 'antd';
import { useAppSelector } from '@/lib/hooks';
import { selectReady } from '@/lib/features/user/userSlice';


export function PageLoading() {
  const isReady = useAppSelector(selectReady);
  return (
    isReady ? null :
      <div className="h-full w-full fixed left-0 top-0 flex justify-center items-center z-10 bg-slate-400/75">
        <Spin />
      </div>
  );
}
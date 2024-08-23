'use client';
import { Spin } from 'antd';

export function PageLoading() {
  return (
    <div className="h-full w-full fixed left-0 top-0 flex justify-center items-center z-10 bg-slate-400/75">
      <Spin />
    </div>
  );
}

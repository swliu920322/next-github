'use client';
import { Spin } from 'antd';

export function PageLoading() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spin />
    </div>
  );
}

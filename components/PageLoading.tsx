import { Spin } from 'antd';

export function PageLoading({ tip = '正在加载...' }: { tip?: string }) {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spin tip={tip}>
        <div className="p-40" />
      </Spin>
    </div>
  );
}

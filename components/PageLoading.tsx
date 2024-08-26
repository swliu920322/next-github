import { Spin } from 'antd';

export function PageLoading() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spin tip="正在加载...">
        <div className="p-40" />
      </Spin>
    </div>
  );
}

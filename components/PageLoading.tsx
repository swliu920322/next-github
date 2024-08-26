import { Spin } from 'antd';

export function PageLoading({
  tip = '正在加载...',
  isFull = false,
}: {
  tip?: string;
  isFull?: boolean;
}) {
  if (isFull) {
    return (
      <div
        className="h-full w-full flex justify-center bg-gray-800/[.8] items-center z-10"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        <Spin tip={tip}>
          <div className="p-40 w-screen h-screen " />
        </Spin>
      </div>
    );
  }
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spin tip={tip}>
        <div className="p-40" />
      </Spin>
    </div>
  );
}

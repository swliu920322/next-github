import Image from 'next/image';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Counter } from '@/components/counter/Counter';

export default function Home() {
  return (
    <>
      <Counter />
      <Link href={process.env.OAUTH_URL}>
        <Button type="primary">登录</Button>
      </Link>
    </>
  );
}

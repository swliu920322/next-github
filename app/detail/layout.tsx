import Link from 'next/link';
import { CompRepo } from './comp-repo';

export default function DetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <CompRepo />
      <div className="flex gap-2">
        <Link className="p-2" href={`/detail`}>
          Detail
        </Link>
        <Link className="p-2" href={`/detail/issues`}>
          Issues
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}

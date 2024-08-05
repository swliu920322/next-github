import { CompRepo } from './comp-repo';

export default function DetailLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col overflow-hidden">
      <CompRepo />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

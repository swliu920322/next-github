'use client';
import { request } from '@/server/apiAgent.mjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MarkdownContent from '@/components/MarkdownContent';

export default function Page() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const name = searchParams.get('name');

  const [readme, setReadme] = useState('');
  useEffect(() => {
    request({ url: `/repos/${owner}/${name}/readme` }).then((resp) => {
      setReadme(atob(resp.data.content));
    });
  }, [owner, name]);

  return <MarkdownContent content={readme} />;
}

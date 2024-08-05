'use client';
import { request } from '@/server/apiAgent.mjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MarkdownIt from 'markdown-it';
import 'github-markdown-css';

const md = MarkdownIt();

export default function Page() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const name = searchParams.get('name');

  const [readme, setReadme] = useState('');
  useEffect(() => {
    request({ url: `/repos/${owner}/${name}/readme` }).then((resp) => {
      setReadme(md.render(atob(resp.data.content)));
    });
  }, [owner, name]);

  return (
    <div className="p-4 markdown-body overflow-auto">
      <div dangerouslySetInnerHTML={{ __html: readme }}></div>
    </div>
  );
}

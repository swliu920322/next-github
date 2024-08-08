'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';

export default function Page() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const name = searchParams.get('name');
  const [issues, setIssues] = useState([])
  const [labels, setLabels] = useState([])
  useEffect(() => {
    request({ url: `/repos/${owner}/${name}/issues` }).then((resp) => {
      console.log(resp.data);
    });
    request({ url: `/repos/${owner}/${name}/labels` }).then((resp) => {
      console.log(resp.data);
    });
  }, [owner, name]);
  return <div>issue</div>;
}

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { request } from '@/server/apiAgent.mjs';
import { CompIssues } from '@/app/detail/issues/comp-issues';

export default function Page() {
  const searchParams = useSearchParams();
  const owner = searchParams.get('owner');
  const name = searchParams.get('name');
  const [issues, setIssues] = useState([]);
  const [labels, setLabels] = useState([]);
  useEffect(() => {
    request({ url: `/repos/${owner}/${name}/issues` }).then((resp) => {
      setIssues(resp.data);
    });
    request({ url: `/repos/${owner}/${name}/labels` }).then((resp) => {
      setLabels(resp.data);
    });
  }, [owner, name]);
  return (
    <div>
      <CompIssues issues={issues} />
    </div>
  );
}

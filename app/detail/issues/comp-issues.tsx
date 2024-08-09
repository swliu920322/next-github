import { Avatar, Button } from 'antd';
import moment from 'moment';
import { useState } from 'react';

// faced some issue
// import dynamic from 'next/dynamic';
// const MarkdownContent = dynamic(() => '@/components/MarkdownContent');
import MarkdownContent from '@/components/MarkdownContent';

function IssueItem({ issue }) {
  const [showDetail, toggleDetail] = useState(false);

  function showDetailFunc() {
    toggleDetail(!showDetail);
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-6 border-b-2 border-blue-300 pb-2">
        <Avatar src={issue?.user?.avatar_url} size={50} shape="square" />
        <div className="flex flex-col flex-1 gap-2">
          <h6>{issue.title}</h6>
          {issue?.labels?.length && (
            <div className="flex gap-2">
              {issue.labels.map((i) => {
                return (
                  <div key={i.id} className="p-2 rounded-xl" style={{ background: `#${i.color}` }}>
                    {i.name}
                  </div>
                );
              })}
            </div>
          )}

          <span>Update at {moment(issue.updated_at).fromNow()}</span>
        </div>
        <Button type="primary" onClick={showDetailFunc}>
          {showDetail ? '隐藏' : '查看'}
        </Button>
      </div>
      {showDetail && (
        <div className="p-4 bg-gray-600">
          <MarkdownContent content={issue.body} />
        </div>
      )}
    </div>
  );
}

export function CompIssues({ issues }) {
  return (
    <div className="flex flex-col gap-3 p-4 pt-0">
      {issues.map((issue) => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

import { Avatar } from 'antd';
import moment from 'moment';

function IssueItem({ issue }) {
  return (
    <div className="flex items-center gap-6 border-b-2 border-blue-300 pb-2">
      <Avatar src={issue?.user?.avatar_url} size={50} shape="square" />
      <div className="flex flex-col gap-2">
        <h6>{issue.title}</h6>
        <span>Update at {moment(issue.updated_at).fromNow()}</span>
      </div>
    </div>
  );
}

export function CompIssues({ issues }) {
  return (
    <div className="flex flex-col gap-3 ">
      {issues.map((issue) => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

import { Avatar } from 'antd';

function IssueItem(issue) {
  return (
    <div className="flex items-center gap-6">
      <Avatar src={issue?.user?.avatar_url} size={50} shape="square" />
      <div className="flex flex-col gap-2">
        <h6>{issue.title}</h6>
        <span>Update at {issue.update_at}</span>
      </div>
    </div>
  );
}

export function CompIssues({ issues }) {
  console.log(issues);
  return (
    <div>
      {issues.map((issue) => (
        <IssueItem key={issue.id} issue={issue} />
      ))}
    </div>
  );
}

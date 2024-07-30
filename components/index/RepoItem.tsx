import Link from 'next/link';
import moment from 'moment';

moment.locale('zh-cn');
import { StarFilled } from '@ant-design/icons';

export function RepoItem(props) {
  const repo = props.item;
  return (
    <div className="flex gap-1 justify-between items-center border-slate-500 border-b py-2">
      <div>
        <div className="flex items-center">
          <Link className="text-xl" href={`/detail?owner=${repo.owner.login}&name=${repo.name}`}>
            {repo.full_name}
          </Link>
          <span className="ml-2 p-0.5 px-2 rounded-2xl border">
            {repo.private ? 'private' : 'public'}
          </span>
        </div>
        <p className="mt-2 mb-2">{repo.description}</p>
        <p className="flex items-center">
          {repo.license && <span className="mr-4"> {repo.license?.name}</span>}
          {
            repo.language &&
            <>
              <span className="p-1.5 h-0 border rounded-full bg-blue-500" />
              <span className="ml-1 mr-2.5">{repo.language}</span>
            </>
          }
          <span> {moment(repo.updated_at).fromNow()}</span>
        </p>
      
      </div>
      <div>
        <span>
          {repo.stargazers_count}
          <StarFilled />
        </span>
      </div>
    </div>
  );
}
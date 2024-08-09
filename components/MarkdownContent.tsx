import MarkdownIt from 'markdown-it';
import 'github-markdown-css';
// client不支持async await，改为服务端之后再开
// import { MDXRemote } from 'next-mdx-remote/rsc';

const md = MarkdownIt();
export default function MarkdownContent({ content = '' }) {
  const data = md.render(content);
  return (
    <div className="p-4 markdown-body overflow-auto">
      <div dangerouslySetInnerHTML={{ __html: data }}></div>
    </div>
  );
}

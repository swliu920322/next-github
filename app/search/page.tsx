import { request } from '@/server/apiAgent.mjs';
import { getQueryStr } from '@/lib/utils/dealPathname';
import { Category, RepoList } from '@/app/search/page.component';

// 查询接口，需要处理一些字段
function getData({ query, language, sort, order, page = 1, per_page = 10 }) {
  const queryStr = getQueryStr({ query, language, sort, order, page, per_page }, true);
  return request({ url: `/search/repositories${queryStr}` }).then((res) => {
    return res?.data || [];
  });
}

const languages = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust'];
const SORT_TYPES = [
  { name: 'Best Match' },
  { name: 'Most Stars', value: 'stars', order: 'desc' },
  { name: 'Fewest Stars', value: 'stars', order: 'asc' },
  { name: 'Most forks', value: 'forks', order: 'desc' },
  { name: 'Fewest forks', value: 'forks', order: 'asc' },
];
export default function Search({ searchParams }) {
  // const [result, setRes] = useState({ items: [] });
  // let [loading, setLoading] = useState(true);
  // const router = useRouter();

  // useEffect(() => {
  // setLoading(true);
  // getData(searchParams)
  //   .then((res) => setRes(res))
  //   .catch((err) => {
  //     console.log(err);
  //     setRes({ items: [] });
  //   })
  //   .finally(() => setLoading(false));
  // }, [searchParams]);

  function handleLanguage(item) {
    // const queryStr = getQueryStr({ ...searchParams, language: item });
    // router.push(`/search${queryStr}`);
    // setRes({ items: [] });
  }

  function handleOrder(item) {
    const queryStr = getQueryStr({ ...searchParams, sort: item.value, order: item.order });
    // router.push(`/search${queryStr}`);
    // setRes({ items: [] });
  }

  function dealSort(item) {
    const { sort, order } = searchParams;
    if (item.value) {
      return item.value === sort && item.order === order;
    }
    return !item.value && !sort;
  }

  return (
    <div className="flex p-4 overflow-hidden h-full">
      <div className="flex w-40 flex-col overflow-auto h-full">
        <Category
          header={<span>语言</span>}
          dataSource={languages}
          // highlight={(i) => i === searchParams.language}
          // dealFunc={handleLanguage}
        />
        <Category
          header={<span>排序</span>}
          dataSource={SORT_TYPES}
          // value={(i) => i.name}
          // highlight={dealSort}
          // dealFunc={handleOrder}
        />
        {/*<List*/}
        {/*  header={<span>语言</span>}*/}
        {/*  bordered*/}
        {/*  dataSource={languages}*/}
        {/*  renderItem={(item) => (*/}
        {/*    <Item*/}
        {/*      className={`cursor-pointer ${item === searchParams.language && 'border-l-2 border-blue-400 active-item'}`}*/}
        {/*      // onClick={() => item !== searchParams.language && handleLanguage(item)}*/}
        {/*    >*/}
        {/*      {item}*/}
        {/*    </Item>*/}
        {/*  )}*/}
        {/*/>*/}
        {/*<List*/}
        {/*  header={<span>排序</span>}*/}
        {/*  bordered*/}
        {/*  dataSource={SORT_TYPES}*/}
        {/*  renderItem={(item) => (*/}
        {/*    <Item*/}
        {/*      className={`cursor-pointer ${dealSort(item) && 'border-l-2 border-blue-400 active-item'}`}*/}
        {/*      // onClick={() => !dealSort(item) && handleOrder(item)}*/}
        {/*    >*/}
        {/*      {item.name}*/}
        {/*    </Item>*/}
        {/*  )}*/}
        {/*/>*/}
      </div>
      <div className="flex-1 flex flex-col ml-4 overflow-hidden h-full relative">
        {/*<div className="flex flex-1 flex-col gap-3 border-slate-500 border-t overflow-auto">*/}
        {/*  {result?.items?.map((item) => <RepoItem key={item.id} item={item} />)}*/}
        {/*</div>*/}
        {/*{loading && (*/}
        {/*  <div className="bg-grey-300 absolute left-0 top-0 w-full h-full flex justify-center items-center">*/}
        {/*    <Spin />*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*<div className="mt-2 self-center">*/}
        {/*  /!* 修复github最大返回数量大于1000的问题*!/*/}
        {/*  <Pagination*/}
        {/*    pageSize={Number(searchParams.per_page) || 10}*/}
        {/*    current={Number(searchParams.page) || 1}*/}
        {/*    total={Math.min(result?.total_count || 0, 1000)}*/}
        {/*    onChange={pageChange}*/}
        {/*  />*/}
        {/*</div>*/}
        <RepoList searchParams={searchParams} />
      </div>
    </div>
  );
}

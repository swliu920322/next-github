import { request } from '@/app/lib/request';
import { getQueryStr } from '@/lib/utils/dealPathname';
import { Category, PageComponent } from '@/app/search/page.component';
import { RepoItem } from '@/components/index/RepoItem';

const languages = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust'];
const SORT_TYPES = [
  { name: 'Best Match' },
  { name: 'Most Stars', value: 'stars', order: 'desc' },
  { name: 'Fewest Stars', value: 'stars', order: 'asc' },
  { name: 'Most forks', value: 'forks', order: 'desc' },
  { name: 'Fewest forks', value: 'forks', order: 'asc' },
];

function getSearchContent(searchParams) {
  const queryStr = getQueryStr(searchParams, true);
  return request(`/github/search/repositories${queryStr}`);
}

export default async function Search({ searchParams }) {
  const listData = await getSearchContent(searchParams);
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
        {/*<Category*/}
        {/*  header={<span>排序</span>}*/}
        {/*  dataSource={SORT_TYPES}*/}
        {/*  // value={(i) => i.name}*/}
        {/*  // highlight={dealSort}*/}
        {/*  // dealFunc={handleOrder}*/}
        {/*/>*/}
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
        <div className="flex flex-1 flex-col gap-3 border-slate-500 border-t overflow-auto">
          {listData?.items?.map((item) => <RepoItem key={item.id} item={item} />)}
        </div>
        <div className="mt-2 self-center">
          <PageComponent searchParams={searchParams} total={listData?.total_count || 0} />
        </div>
      </div>
    </div>
  );
}

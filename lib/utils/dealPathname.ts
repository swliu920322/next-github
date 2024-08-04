function dealCode(str = '') {
  return str.includes('?') ? '&' : '?';
}

//  获取路由接口
//  url上一直都是 ?a=b&b=c...
//  重新设计，只有提交api的时候进行query => q, &language= => +language:
export function getQueryStr(item: Record<string, string | number>, isRequest = false) {
  const { query, language, sort, order = 'desc', page = 1, per_page = 10 } = item;
  let queryStr = `?${isRequest ? 'q' : 'query'}=${query}`;
  if (language) {
    queryStr += `${isRequest ? '+' : '&'}language${isRequest ? ':' : '='}${language}`;
  }
  if (sort) queryStr += `${dealCode(queryStr)}sort=${sort}`;
  if (order) queryStr += `${dealCode(queryStr)}order=${order}`;
  if (page) queryStr += `${dealCode(queryStr)}page=${page}`;
  if (per_page) queryStr += `${dealCode(queryStr)}per_page=${per_page}`;
  return queryStr;
}

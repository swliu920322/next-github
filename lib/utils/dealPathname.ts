function dealCode(str = '') {
  return str.includes('?') ? '&' : '?';
}

//  获取路由接口
export function getQueryStr(item: Record<string, string>, replaceFunc = i => i) {
  const { query, language, sort, order = 'desc', page } = item;
  let queryStr = '';
  if (query) {
    const queryArr = query.split(' ');
    if (queryArr.length > 1) {
      queryStr += `?${replaceFunc('q')}=${queryArr[0]}`;
      if (language) {
        queryStr += `+language:${language}`;
      } else {
        const lang = queryArr[1].split(':');
        if (lang.length > 1) {
          queryStr += `+language:${lang[1]}`;
        }
      }
      
    } else {
      queryStr += `?${replaceFunc('q')}=${query}`;
      if (language) queryStr += `+language:${language}`;
    }
  } else {
    queryStr += `?q=`;
  }
  if (sort) queryStr += `${dealCode(queryStr)}sort=${sort}`;
  if (order) queryStr += `${dealCode(queryStr)}order=${order}`;
  if (page) queryStr += `${dealCode(queryStr)}page=${page}`;
  return queryStr;
}

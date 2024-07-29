import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

export function useDealLogin() {
  const router = useRouter();
  // router.push(process.env.OAUTH_URL);
  const pathname = usePathname();
  let url = `/prepare-auth`
  return {
    login: () => {
      console.log('pathname', pathname);
      if(pathname) {
        url += `?url=${pathname}`
      }
      console.log('url', url);
      axios.get(url)
        .then(() => {
          console.log('then');
          router.push(process.env.OAUTH_URL);
        })
    }
  };
}
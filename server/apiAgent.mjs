import axios from 'axios';

const github_base_url = 'https://api.github.com';

function requestGithub(method, url, data, headers) {
  console.log(`${github_base_url}${url}`);
  return axios({ method, url: `${github_base_url}${url}`, data, headers });
}

const isServer = typeof window === 'undefined';

function request({ method = 'GET', url, data = {} }, req = {}) {
  if (!url) {
    throw Error('url must provide');
  }
  // if (isServer) {
  //   const session = req.session;
  //   const githubAuth = session.githubAuth || {};
  //   const headers = {};
  //   if (githubAuth.access_token) {
  //     const { access_token, token_type } = githubAuth;
  //     headers['Authorization'] = `${token_type} ${access_token}`;
  //   }
  //   return requestGithub(method, url, data, headers);
  // }
  console.log(`/github${url}`);
  return axios({ method, url: `/github${url}`, data });
}

export {
  request,
  requestGithub,
};
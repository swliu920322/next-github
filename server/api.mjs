import { requestGithub } from './apiAgent.mjs';

// const github_base_url = 'https://api.github.com';
export default (server) => {
  server.use(async (ctx, next) => {
    const { path } = ctx;
    if (path.startsWith('/github/')) {
      const githubAuth = ctx.session.githubAuth;
      const githubPath = `${ctx.url.replace('/github/', '/')}`;
      const token = githubAuth && githubAuth.access_token;
      let headers = {};
      if (token) {
        const { access_token, token_type } = githubAuth;
        headers['Authorization'] = `${token_type} ${access_token}`;
      }
      ctx.set('Content-type', 'application/json');
      try {
        console.log({ githubPath, headers });
        const resp = await requestGithub('GET', githubPath, ctx.request.body || {}, headers);
        console.log(resp.status);
        ctx.status = resp.status;
        ctx.body = resp.status === 200 ? resp.data : [];
      } catch (err) {
        console.log(err);
        ctx.status = 500;
        ctx.body = [];
      }
    } else {
      await next();
    }
  });
}
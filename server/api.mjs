import axios from 'axios';
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
        const resp = await requestGithub('GET', githubPath, headers);
        if (resp.status === 200) {
          ctx.body = resp.data;
        } else {
          ctx.status = resp.status;
          ctx.body = {
            success: false,
          };
        }
      } catch (err) {
        console.log(err);
        ctx.body = {
          success: false,
        };
      }

    } else {
      await next();
    }
  });
}
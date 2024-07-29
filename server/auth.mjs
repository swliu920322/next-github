import axios from 'axios';
import { config } from '../config.mjs';

const { github: { client_id, client_secret, gitAccess, gitUser } } = config;
export default (server) => {
  server
    .use(async (ctx, next) => {
      if (ctx.path === '/auth') {
        const code = ctx.query.code;
        if (!code) {
          ctx.body = 'code not exist';
          return;
        }
        const result = await axios({
          method: 'POST',
          url: gitAccess,
          data: { client_id, client_secret, code },
          headers: { Accept: 'application/json' },
        });
        if (result.status === 200) {
          const { access_token, token_type } = result.data;
          const userInfoRes = await axios({
            method: 'POST',
            url: gitUser,
            headers: {
              Authorization: `${token_type} ${access_token}`,
            },
          });
          ctx.session.githubAuth = result.data;
          ctx.session.userInfo = userInfoRes.data;
          console.log('urlBeforeOAuth', ctx.session.urlBeforeOAuth );
          ctx.redirect(ctx.session.urlBeforeOAuth || '/');
        } else {
          const errorMsg = result.data && result.data.error;
          ctx.body = `request token failed ${errorMsg}`;
        }
      } else {
        await next();
      }
    })
    .use(async (ctx, next) => {
      if (ctx.path === '/logout' && ctx.method === 'POST') {
        ctx.status = 200;
        ctx.body = 'logout success';
        ctx.session = null;
      } else {
        await next();
      }
    })
    .use(async (ctx, next) => {
      if (ctx.path === '/prepare-auth' && ctx.method === 'GET') {
        ctx.status = 200;
        ctx.body = 'prepare success';
        const { url } = ctx.query;
        console.log(url);
        ctx.session.urlBeforeOAuth = url || '/';
      } else {
        await next();
      }
    })
    .use(async (ctx, next) => {
      ctx.req.session = ctx.session;
      console.log(ctx.session);
      await next();
    });
};
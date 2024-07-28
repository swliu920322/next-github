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
          ctx.session.githubAuth = result.data;
          const { access_token, token_type } = result.data;
          const userInfoRes = await axios({
            method: 'POST',
            url: gitUser,
            headers: {
              Authorization: `${token_type} ${access_token}`,
            },
          });
          ctx.session.userInfo = userInfoRes.data;
          ctx.redirect('/');
        } else {
          const errorMsg = result.data && result.data.error;
          ctx.body = `request token failed ${errorMsg}`;
        }
      } else {
        await next();
      }
    })
    .use(async (ctx, next) => {
      ctx.req.session = ctx.session;
      await next();
    });
};
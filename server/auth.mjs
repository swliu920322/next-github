import axios from 'axios';
import { config } from '../config.mjs';

const { github: { client_id, client_secret, gitAccess } } = config;
export default (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/auth') {
      const code = ctx.query.code;
      if (!code) {
        ctx.body = 'code not exist';
      }
      const result = await axios({
        method: 'POST',
        url: gitAccess,
        data: {
          client_id,
          client_secret,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      });
      console.log(JSON.stringify(result));
      if (result.status === 200) {
        ctx.session.githubAuth = result.data;
        ctx.redirect('/');
      } else {
        ctx.body = `request token failed ${result.message}`;
      }
    } else {
      await next();
    }

  });
};
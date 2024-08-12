import Koa from 'koa';
import Session from 'koa-session';
import next from 'next';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import Redis from 'ioredis';

import koaRouter from './server/router.mjs';
import authServer from './server/auth.mjs';
import apiServer from './server/api.mjs';
// 服务端渲染找不到atob，但是我在client里使用了，之后可能为了性能改回服务端
// import atob from 'atob';
//
// global.atob = atob;
const dev = process.env.NODE_ENV !== 'production';


const app = next({ dev });
const handle = app.getRequestHandler();


import RedisSessionStore from './server/session-store.mjs';

const redis = new Redis();

let index = 0;
app.prepare()
  .then(() => {
    const server = new Koa();
    server.keys = ['Max develop Github App'];
    const SESSION_CONFIG = {
      key: 'mid',
      store: new RedisSessionStore(redis),
    };

    server
      .use(koaBody())
      .use(Session(SESSION_CONFIG, server))
      .use(async (ctx, next) => {
        ctx.req.session = ctx.session;
        // console.log('session is:', ctx.session);
        await next();
      });

    koaRouter.get(/.*/, async (ctx) => {
      ctx.cookies.set('id', index);
      index += 1;
      ctx.respond = false;
      ctx.response.status = 200;
      await handle(ctx.req, ctx.res);
    });

    authServer(server);
    apiServer(server);
    server
      .use(cors({ origin: '*' }))
      .use(koaRouter.routes())
      .use(koaRouter.allowedMethods())
      .listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
      });
  });
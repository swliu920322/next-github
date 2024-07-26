const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const cors = require('@koa/cors');

const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare()
  .then(() => {
    const server = new Koa();
    const router = new Router();

    router.get(/.*/, async (ctx) => {
      ctx.respond = false;
      ctx.response.status = 200;
      await handle(ctx.req, ctx.res);
    });

    server
      .use(cors({ origin: '*' }))
      .use(router.routes())
      .use(router.allowedMethods())
      .listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
      });
  });
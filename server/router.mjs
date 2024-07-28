import Router from 'koa-router';

const koaRouter = new Router();
koaRouter
  .get('/delete/user', async (ctx) => {
    // koa-session会自动destroy所有session
    ctx.session = null;
    ctx.body = 'clear session success';
  })
  .get('/api/user/userInfo', async ctx => {
    const user = ctx.session.userInfo;
    if (!user) {
      ctx.status = 401;
      ctx.body = 'need login';
    } else {
      ctx.body = user;
      ctx.set('Content-type', 'application/json');
    }
  })
  .post('/api/counter', async (ctx, next) => {
    console.log('ctx', ctx);
    ctx.respond = true;
    ctx.body = { data: 2 };
    ctx.respondType = 'application/json';
    ctx.response.status = 200;
    await next();
  });


export default koaRouter;
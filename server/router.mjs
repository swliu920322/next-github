import Router from 'koa-router';

const koaRouter = new Router();
koaRouter.get('/set/user', async (ctx) => {
  ctx.session.user = {
    name: 'MAX',
    age: 30,
  };
  ctx.body = 'set session success';
})
  .get('/delete/user', async (ctx) => {
    // koa-session会自动destroy所有session
    ctx.session = null;
    ctx.body = 'clear session success';
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
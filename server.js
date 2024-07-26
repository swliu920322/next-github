const Koa = require('koa');
const Router = require('koa-router')
const sta = require('koa-static');
const path = require('path');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production'
const app = next({
    dev, conf: {
        assetPrefix: '/public'
    }
})
const handle = app.getRequestHandler();
const staticPath = '/.next/static';
app.prepare()
    .then(() => {
        const server = new Koa();
        const router = new Router()
        server.use(sta(path.join(__dirname, staticPath)));
        server.use(async (ctx, next) => {
            await handle(ctx.req, ctx.res);
            ctx.response = false;
        })
        // router.get('*', async (ctx, next) => {
        //     await handle(ctx.req, ctx.res)
        //     ctx.respond = false
        // })
        server.use(router.routes())
        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        });
    })
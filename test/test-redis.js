const Redis = require("ioredis");

async function test() {
    const Redis = require('ioredis');

    const redis = new Redis({
        port: 6378,
        password: '123456'
    })
    const keys = await redis.keys('*');
    console.log(keys);
    const value = await redis.get(keys[0]);
    console.log(value)
    await redis.setex('c', 10, 100);
    console.log(await redis.get('c'));
    setTimeout(async ()  => {
        const val= await redis.get('c');
        console.log(val)
    }, 10* 1000)
}

test()
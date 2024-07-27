function getRedisSessionId(sid) {
  return `ssid: ${sid}`;
}

class RedisSessionStore {
  client;

  constructor(client) {
    this.client = client;
  }

  // 获取redis存储的session数据
  async get(sid) {
    console.log('get session', sid);
    const id = getRedisSessionId(sid);
    const data = await this.client.get(id);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch (err) {
      console.log(err);
    }
  }

  async set(sid, session, ttl) {
    console.log('set session', sid);
    const id = getRedisSessionId(sid);
    {
      if (typeof ttl === 'number') {
        ttl = Math.ceil(ttl / 1000);
      }
      try {
        const sessionStr = JSON.stringify(session);
        if (ttl) {
          await this.client.setex(id, ttl, sessionStr);
        } else {
          await this.client.set(id, sessionStr);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async destroy(sid) {
    console.log('destroy session', sid);
    const id = getRedisSessionId(sid);
    await this.client.del(id);
  }


}

export default RedisSessionStore;

import Redis from 'ioredis'

export interface ICache {
  get(path: string, fetcher: Function): Promise<any>
  set(path: string, content: any): Promise<any>
  use(path: string, fetcher: Function): Promise<any>
  clear(path: string, forceHardDelete?: boolean): Promise<boolean>
  clearAll(): Promise<any>
}

class CacheNotFoundError extends Error {
  constructor(path: string) {
    super(`Cache not found for: ${path}`)
  }
}

export default class Cache implements ICache {
  constructor(private redis = new Redis(process.env.REDIS_URL)) {}

  public async use(path, fetcher) {
    return this.get(path).catch(_e => this.runFetcherThenSave(path, fetcher))
  }

  public async get(path) {
    const content = await this.redis.get(path)
    if (!content) throw new CacheNotFoundError(path)
    return JSON.parse(content)
  }

  public async set(path, content) {
    const expires = Number(process.env.CACHE_TIME || 180000)
    const json = JSON.stringify(content)
    await this.redis.set(path, json, 'EX', Math.floor(expires / 1000))
    return content
  }

  public async clear(path) {
    const content = await this.getCache(path)
    if (!content) return false
    await this.redis.del(path)
    return true
  }

  public async clearAll() {
    return this.redis.flushall('ASYNC')
  }

  private async getCache(path: string) {
    const content = await this.redis.get(path)
    if (!content) throw new CacheNotFoundError(path)
    return JSON.parse(content)
  }

  private async runFetcherThenSave(path, fetcher) {
    const response = await fetcher()
    return this.set(path, response)
  }
}

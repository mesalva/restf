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

  public async use(fullPath, fetcher) {
    return this.get(fullPath, fetcher).catch(_e => this.getFromFetcherSavingAsynchronously(fullPath, fetcher))
  }

  public async get(fullPath, fetcher) {
    return this.getCacheSavingIfNeeded(fullPath, fetcher)
  }

  public async set(path, content) {
    const expires = new Date().getTime() + Number(process.env.CACHE_TIME || 180000)
    const json = JSON.stringify({ content, expires })
    await this.redis.set(path, json)
    return { content, expires }
  }

  public async clear(path, forceHardDelete = false) {
    const content = await this.getCache(path)
    if (forceHardDelete) await this.hardDelete(path)
    else await this.softDelete(path, content)
    return !!content
  }

  public async clearAll() {
    return this.redis.flushall('ASYNC')
  }

  private async getCache(path: string) {
    const content = await this.redis.get(path)
    if (!content) throw new CacheNotFoundError(path)
    //TODO here
    return JSON.parse(content)
  }

  private async getFromFetcherSavingAsynchronously(fullPath, fetcher) {
    const { expires, content } = await this.runFetcherThenSave(fullPath, fetcher)
    return this.sendContent({ content, expires })
  }

  private async getCacheSavingIfNeeded(path, fetcher) {
    const result = await this.getCache(path)
    if (result.expires < new Date().getTime()) this.runFetcherThenSave(path, fetcher)
    return this.sendContent(result)
  }

  private async runFetcherThenSave(path, fetcher) {
    const response = await fetcher()
    return this.set(path, response)
  }

  private sendContent({ content, expires }) {
    Object.defineProperty(content, 'expires', { value: expires, enumerable: false })
    return content
  }

  private softDelete(path, content) {
    const cache = JSON.parse(content)
    const now = new Date().getTime()
    cache.expires = now - 100
    const json = JSON.stringify(cache)
    return this.redis.set(path, json)
  }

  private hardDelete(path: string) {
    return this.redis.del(path)
  }
}

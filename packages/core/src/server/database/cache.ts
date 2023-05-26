import { QueryResultCache } from 'typeorm/cache/QueryResultCache';
import { QueryResultCacheOptions } from 'typeorm/cache/QueryResultCacheOptions';

export class MemoryQueryResultCache implements QueryResultCache {
  cache: Record<string, any> = {};

  private getKey(query?: string, identifier?: string) {
    return identifier ? identifier + '__' + query : query || '';
  }

  async connect() {
    return;
  }
  async disconnect() {
    return;
  }
  async synchronize() {
    return;
  }

  async getFromCache(options: QueryResultCacheOptions) {
    const { identifier, query, duration } = options;
    const key = this.getKey(query, identifier);
    const result = this.cache[key]?.value;
    return (
      result && {
        identifier,
        query,
        duration,
        result,
      }
    );
  }

  async storeInCache(options: QueryResultCacheOptions) {
    const { identifier, duration, result, query } = options;
    this.cache[this.getKey(query, identifier)] = {
      value: result,
      expireAt: new Date().getTime() + duration,
    };
  }

  isExpired(savedCache: QueryResultCacheOptions) {
    const { identifier, query } = savedCache;
    const cache = this.cache[this.getKey(query, identifier)];
    if (cache) {
      return cache.expireAt < new Date().getTime();
    }
    return false;
  }

  async clear() {
    this.cache = {};
  }

  async remove(identifiers: string[]): Promise<void> {
    for (const identifier of identifiers) {
      for (const key in this.cache) {
        if (key.startsWith(identifier + '__')) {
          delete this.cache[key];
        }
      }
    }
  }
}

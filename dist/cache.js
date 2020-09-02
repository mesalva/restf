"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
class CacheNotFoundError extends Error {
    constructor(path) {
        super(`Cache not found for: ${path}`);
    }
}
class Cache {
    constructor(redis = null) {
        if (redis)
            this.redis = redis;
        else if (process.env.REDIS_URL)
            this.redis = new ioredis_1.default(process.env.REDIS_URL);
    }
    use(path, fetcher) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.redis)
                return fetcher();
            return this.get(path).catch(_e => this.runFetcherThenSave(path, fetcher));
        });
    }
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.redis.get(path);
            if (!content)
                throw new CacheNotFoundError(path);
            return JSON.parse(content);
        });
    }
    set(path, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const expires = Number(process.env.CACHE_TIME || 180000);
            const json = JSON.stringify(content);
            yield this.redis.set(path, json, 'EX', Math.floor(expires / 1000));
            return content;
        });
    }
    clear(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.getCache(path);
            if (!content)
                return false;
            yield this.redis.del(path);
            return true;
        });
    }
    clearAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.redis.flushall('ASYNC');
        });
    }
    getCache(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.redis.get(path);
            if (!content)
                throw new CacheNotFoundError(path);
            return JSON.parse(content);
        });
    }
    runFetcherThenSave(path, fetcher) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetcher();
            return this.set(path, response);
        });
    }
}
exports.default = Cache;

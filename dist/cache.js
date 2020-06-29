"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = require("ioredis");
var CacheNotFoundError = /** @class */ (function (_super) {
    __extends(CacheNotFoundError, _super);
    function CacheNotFoundError(path) {
        return _super.call(this, "Cache not found for: " + path) || this;
    }
    return CacheNotFoundError;
}(Error));
var Cache = /** @class */ (function () {
    function Cache(redis) {
        if (redis === void 0) { redis = new ioredis_1.default(process.env.REDIS_URL); }
        this.redis = redis;
    }
    Cache.prototype.use = function (fullPath, fetcher) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.get(fullPath, fetcher).catch(function (_e) { return _this.getFromFetcherSavingAsynchronously(fullPath, fetcher); })];
            });
        });
    };
    Cache.prototype.get = function (fullPath, fetcher) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getCacheSavingIfNeeded(fullPath, fetcher)];
            });
        });
    };
    Cache.prototype.set = function (path, content) {
        return __awaiter(this, void 0, void 0, function () {
            var expires, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expires = new Date().getTime() + Number(process.env.CACHE_TIME || 180000);
                        json = JSON.stringify({ content: content, expires: expires });
                        return [4 /*yield*/, this.redis.set(path, json)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { content: content, expires: expires }];
                }
            });
        });
    };
    Cache.prototype.clear = function (path, forceHardDelete) {
        if (forceHardDelete === void 0) { forceHardDelete = false; }
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCache(path)];
                    case 1:
                        content = _a.sent();
                        if (!forceHardDelete) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.hardDelete(path)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.softDelete(path, content)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, !!content];
                }
            });
        });
    };
    Cache.prototype.clearAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.redis.flushall('ASYNC')];
            });
        });
    };
    Cache.prototype.getCache = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.redis.get(path)];
                    case 1:
                        content = _a.sent();
                        if (!content)
                            throw new CacheNotFoundError(path);
                        //TODO here
                        return [2 /*return*/, JSON.parse(content)];
                }
            });
        });
    };
    Cache.prototype.getFromFetcherSavingAsynchronously = function (fullPath, fetcher) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, expires, content;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.runFetcherThenSave(fullPath, fetcher)];
                    case 1:
                        _a = _b.sent(), expires = _a.expires, content = _a.content;
                        return [2 /*return*/, this.sendContent({ content: content, expires: expires })];
                }
            });
        });
    };
    Cache.prototype.getCacheSavingIfNeeded = function (path, fetcher) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCache(path)];
                    case 1:
                        result = _a.sent();
                        if (result.expires < new Date().getTime())
                            this.runFetcherThenSave(path, fetcher);
                        return [2 /*return*/, this.sendContent(result)];
                }
            });
        });
    };
    Cache.prototype.runFetcherThenSave = function (path, fetcher) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetcher()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.set(path, response)];
                }
            });
        });
    };
    Cache.prototype.sendContent = function (_a) {
        var content = _a.content, expires = _a.expires;
        Object.defineProperty(content, 'expires', { value: expires, enumerable: false });
        return content;
    };
    Cache.prototype.softDelete = function (path, content) {
        var cache = JSON.parse(content);
        var now = new Date().getTime();
        cache.expires = now - 100;
        var json = JSON.stringify(cache);
        return this.redis.set(path, json);
    };
    Cache.prototype.hardDelete = function (path) {
        return this.redis.del(path);
    };
    return Cache;
}());
exports.default = Cache;
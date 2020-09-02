"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cache_1 = __importDefault(require("./cache"));
const _ControllerModels_1 = __importDefault(require("./.ControllerModels"));
class RestfController extends _ControllerModels_1.default {
    constructor(req, res) {
        super();
        this.currentMethod = 'undefined';
        this.req = req;
        this.res = res;
    }
    cached(path, method) {
        return new cache_1.default().use(path, method);
    }
    clearCache(path) {
        return new cache_1.default().clear(path);
    }
    run(method, ...args) {
        this.currentMethod = method;
        return this[method](...args);
    }
    status(code) {
        this.res.status(code);
        return this;
    }
    respondWith(data = {}, options = {}) {
        if (this.sent)
            return null;
        if (options.status || data.statusCode) {
            this.res.status(options.status || data.statusCode);
            delete data.statusCode;
        }
        if (options.status || Object.keys(data).length > 0)
            return this.sendWithMiddlewares(data);
        this.sent = true;
        this.res.status(204);
        return this.res.send();
    }
    send(data = {}) {
        if (this.sent)
            return null;
        if (data.statusCode) {
            this.res.status(data.statusCode);
            delete data.statusCode;
        }
        if (Object.keys(data).length === 0)
            return this.sendEmptyResponses();
        return this.sendWithMiddlewares(data);
    }
    get routeParams() {
        return this.req.params || {};
    }
    get queryParams() {
        return this.req.query || {};
    }
    get body() {
        return this.req.body || {};
    }
    get headers() {
        return this.req.headers || {};
    }
    get pathname() {
        return this.req.url;
    }
    get currentUser() {
        if (this.req.credentials)
            return this.req.credentials;
        if (this.req.headers.uid && this.req.headers['access-token']) {
            this.req.credentials = { uid: this.req.headers.uid, accessToken: this.req.headers['access-token'] };
            return this.req.credentials;
        }
        const authorization = this.req.cookies.token || this.req.headers.authorization;
        if (!authorization)
            return null;
        const token = authorization.replace(/bearer( +)?/i, '');
        if (!token)
            return null;
        this.req.credentials = this.tokenToCredentials(token);
        Object.defineProperty(this.req.credentials, 'iat', { enumerable: false });
        Object.defineProperty(this.req.credentials, 'exp', { enumerable: false });
        return this.req.credentials;
    }
    tokenToCredentials(token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
    }
    serialize(...a) {
        const constructor = this.constructor;
        const Serializer = constructor.serializer;
        if (!Serializer)
            return null;
        const currentMethod = this.currentMethod;
        return new Serializer(this)[currentMethod](...a);
    }
    sendWithMiddlewares(data, i = 0) {
        if (this.req.afterMiddlewares && i < this.req.afterMiddlewares.length) {
            return this.req.afterMiddlewares[i](this, data, newData => this.sendWithMiddlewares(newData, i + 1));
        }
        if (this.sent)
            return null;
        this.sent = true;
        if (typeof data === 'string')
            return this.res.send(data);
        return this.res.json(data);
    }
    params(...permit) {
        const controllerPermit = this.permit;
        if (controllerPermit)
            permit = [...controllerPermit, ...permit];
        if (permit.length === 0)
            return this.req.body;
        return objectFilter(this.req.body, permit);
    }
    sendEmptyResponses() {
        this.sent = true;
        this.res.status(204);
        return this.res.send();
    }
}
exports.default = RestfController;
RestfController.serialize = undefined;
function objectFilter(obj, fields) {
    return fields.reduce((result, field) => {
        if (obj[field])
            result[field] = obj[field];
        return result;
    }, {});
}

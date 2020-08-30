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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var cache_1 = require("./cache");
var _ControllerModels_1 = require("./.ControllerModels");
var RestfController = /** @class */ (function (_super) {
    __extends(RestfController, _super);
    function RestfController(req, res) {
        var _this = _super.call(this) || this;
        _this.currentMethod = 'undefined';
        _this.req = req;
        _this.res = res;
        return _this;
    }
    RestfController.prototype.cached = function (path, method) {
        return new cache_1.default().use(path, method);
    };
    RestfController.prototype.clearCache = function (path) {
        return new cache_1.default().clear(path);
    };
    RestfController.prototype.run = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.currentMethod = method;
        return this[method].apply(this, args);
    };
    RestfController.prototype.status = function (code) {
        this.res.status(code);
        return this;
    };
    RestfController.prototype.respondWith = function (data, options) {
        if (data === void 0) { data = {}; }
        if (options === void 0) { options = {}; }
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
    };
    RestfController.prototype.send = function (data) {
        if (data === void 0) { data = {}; }
        if (this.sent)
            return null;
        if (data.statusCode) {
            this.res.status(data.statusCode);
            delete data.statusCode;
        }
        if (Object.keys(data).length === 0)
            return this.sendEmptyResponses();
        return this.sendWithMiddlewares(data);
    };
    Object.defineProperty(RestfController.prototype, "routeParams", {
        get: function () {
            return this.req.params || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RestfController.prototype, "queryParams", {
        get: function () {
            return this.req.query || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RestfController.prototype, "body", {
        get: function () {
            return this.req.body || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RestfController.prototype, "headers", {
        get: function () {
            return this.req.headers || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RestfController.prototype, "pathname", {
        get: function () {
            return this.req.url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RestfController.prototype, "currentUser", {
        get: function () {
            if (this.req.credentials)
                return this.req.credentials;
            var authorization = this.req.cookies.token || this.req.headers.authorization;
            if (!authorization)
                return null;
            var token = authorization.replace(/bearer( +)?/i, '');
            if (!token)
                return null;
            this.req.credentials = this.tokenToCredentials(token);
            Object.defineProperty(this.req.credentials, 'iat', { enumerable: false });
            Object.defineProperty(this.req.credentials, 'exp', { enumerable: false });
            return this.req.credentials;
        },
        enumerable: true,
        configurable: true
    });
    RestfController.prototype.tokenToCredentials = function (token) {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
    };
    RestfController.prototype.serialize = function () {
        var _a;
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        var constructor = this.constructor;
        var Serializer = constructor.serializer;
        if (!Serializer)
            return null;
        var currentMethod = this.currentMethod;
        return (_a = new Serializer(this))[currentMethod].apply(_a, a);
    };
    RestfController.prototype.sendWithMiddlewares = function (data, i) {
        var _this = this;
        if (i === void 0) { i = 0; }
        if (this.req.afterMiddlewares && i < this.req.afterMiddlewares.length) {
            return this.req.afterMiddlewares[i](this, data, function (newData) { return _this.sendWithMiddlewares(newData, i + 1); });
        }
        if (this.sent)
            return null;
        this.sent = true;
        if (typeof data === 'string')
            return this.res.send(data);
        return this.res.json(data);
    };
    RestfController.prototype.params = function () {
        var permit = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            permit[_i] = arguments[_i];
        }
        var controllerPermit = this.permit;
        if (controllerPermit)
            permit = __spreadArrays(controllerPermit, permit);
        if (permit.length === 0)
            return this.req.body;
        return objectFilter(this.req.body, permit);
    };
    RestfController.prototype.sendEmptyResponses = function () {
        this.sent = true;
        this.res.status(204);
        return this.res.send();
    };
    RestfController.serialize = undefined;
    return RestfController;
}(_ControllerModels_1.default));
exports.default = RestfController;
function objectFilter(obj, fields) {
    return fields.reduce(function (result, field) {
        if (obj[field])
            result[field] = obj[field];
        return result;
    }, {});
}

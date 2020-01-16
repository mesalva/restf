"use strict";
exports.__esModule = true;
var RestfSerializer = /** @class */ (function () {
    function RestfSerializer(controller) {
        if (controller === void 0) { controller = undefined; }
        this.controller = controller;
    }
    RestfSerializer.prototype.set = function (obj) {
        var _this = this;
        Object.entries(obj).forEach(function (_a) {
            var name = _a[0], value = _a[1];
            return (_this[name] = value);
        });
    };
    RestfSerializer.prototype.get = function (path) {
        if (!/\./.test(path))
            return this[path];
        var paths = path.split('.');
        return this[paths[0]][paths[1]];
    };
    RestfSerializer.use = function (method) {
        return new this()[method];
    };
    RestfSerializer.staticfy = function () {
        var _this = this;
        var methods = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            methods[_i] = arguments[_i];
        }
        methods.forEach(function (method) {
            "";
            _this[method] = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return (_a = new _this())[method].apply(_a, args);
            };
        });
    };
    return RestfSerializer;
}());
exports["default"] = RestfSerializer;

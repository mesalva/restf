"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var _database_1 = require("./.database");
var RestfModel = /** @class */ (function () {
    function RestfModel(table) {
        var _this = this;
        this.table = table;
        this.db = _database_1.default(table);
        this.db.constructor.prototype.raw = function (query, options) {
            if (options === void 0) { options = []; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, _database_1.default.raw(query.replace(/\n/g, ' '), options).then(function (_a) {
                            var rows = _a.rows;
                            return rows;
                        })];
                });
            });
        };
        this.db.constructor.prototype.firstParsed = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = _this.db).first.apply(_a, args).then(parseSingle);
        };
        this.db.constructor.prototype.selectParsed = function () {
            var _a;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = _this.db).select.apply(_a, args).then(parseMulti);
        };
        this.db.constructor.insertReturning = function (content) {
            var returns = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                returns[_i - 1] = arguments[_i];
            }
            return _this.db
                .insert(content)
                .returning('id')
                .then(function (_a) {
                var id = _a[0];
                return id;
            })
                .then(function (id) {
                var _a;
                return (_a = _database_1.default(table)
                    .where({ id: id })).first.apply(_a, returns);
            });
        };
    }
    RestfModel.prototype.all = function () {
        return this.db.select();
    };
    RestfModel.prototype.find = function (id) {
        return this.db
            .first()
            .where({ id: id })
            .then(function (data) { return (data ? data : Promise.reject(new Error('Content Not Found'))); });
    };
    RestfModel.prototype.findBy = function (column, value) {
        var _a;
        return this.db
            .first()
            .where((_a = {}, _a[column] = value, _a))
            .then(function (data) { return (data ? data : Promise.reject(new Error('Content Not Found'))); });
    };
    RestfModel.prototype.insertGetId = function (data) {
        return this.db
            .insert(data)
            .returning('id')
            .then(function (ids) { return ({ id: ids[0] }); });
    };
    RestfModel.prototype.create = function (data) {
        return this.insertGetId(data);
    };
    RestfModel.prototype.update = function (data, whereClause) {
        var db = this.db.update(data);
        if (!whereClause)
            return db;
        return db.where(whereClause);
    };
    RestfModel.prototype.delete = function (id) {
        return this.db
            .where({ id: id })
            .delete()
            .then(function () { return ({ id: id }); });
    };
    RestfModel.newDefaultData = function (data) {
        return __assign(__assign({}, data), { createdAt: new Date() });
    };
    return RestfModel;
}());
exports.default = RestfModel;
function parseSingle(data) {
    if (!data)
        return data;
    var data2 = {};
    for (var field in data) {
        if (field.match('_')) {
            var _a = field.split('_'), name_1 = _a[0], subName = _a[1];
            if (!data2[name_1])
                data2[name_1] = {};
            data2[name_1][subName] = data[field];
        }
        else {
            data2[field] = data[field];
        }
    }
    return data2;
}
function parseMulti(data) {
    if (!data)
        return data;
    return data.map(parseSingle);
}

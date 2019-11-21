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
exports.__esModule = true;
var database_1 = require("./database");
var BaseModel = /** @class */ (function () {
    function BaseModel(table) {
        this.db = database_1["default"](table);
    }
    BaseModel.prototype.all = function () {
        return this.db.select();
    };
    BaseModel.prototype.find = function (id) {
        return this.db
            .first()
            .where({ id: id })
            .then(function (data) {
            return data ? data : Promise.reject(new Error("Content Not Found"));
        });
    };
    BaseModel.prototype.findBy = function (column, value) {
        var _a;
        return this.db
            .first()
            .where((_a = {}, _a[column] = value, _a))
            .then(function (data) {
            return data ? data : Promise.reject(new Error("Content Not Found"));
        });
    };
    BaseModel.prototype.insertGetId = function (data) {
        return this.db
            .insert(data)
            .returning("id")
            .then(function (ids) { return ({ id: ids[0] }); });
    };
    BaseModel.prototype.create = function (data) {
        return this.insertGetId(data);
    };
    BaseModel.prototype.update = function (data, whereClause) {
        var db = this.db.update(data);
        if (!whereClause)
            return db;
        return db.where(whereClause);
    };
    BaseModel.prototype["delete"] = function (id) {
        return this.db.where({ id: id })["delete"]().then(function () { return ({ id: id }); });
    };
    BaseModel.newDefaultData = function (data) {
        return __assign(__assign({}, data), { createdAt: new Date() });
    };
    return BaseModel;
}());
exports["default"] = BaseModel;

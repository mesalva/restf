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
const _database_1 = __importDefault(require("./_database"));
class RestfModel {
    constructor(table) {
        this.table = table;
        this.db = _database_1.default(table);
        this.db.constructor.prototype.raw = (query, options = []) => __awaiter(this, void 0, void 0, function* () {
            return _database_1.default.raw(query.replace(/\n/g, ' '), options).then(({ rows }) => rows);
        });
        this.db.constructor.prototype.firstParsed = (...args) => {
            return this.db.first(...args).then(parseSingle);
        };
        this.db.constructor.prototype.selectParsed = (...args) => {
            return this.db.select(...args).then(parseMulti);
        };
        this.db.constructor.prototype.innerJoinWithManyAnds = (table, ...args) => {
            return this.db.innerJoin(table, function () {
                const [a, b, c, d] = args;
                this.on(a, '=', b).andOn(c, '=', d);
            });
        };
        this.db.constructor.insertReturning = (content, ...returns) => {
            return this.db
                .insert(content)
                .returning('id')
                .then(([id]) => id)
                .then(id => _database_1.default(table)
                .where({ id })
                .first(...returns));
        };
    }
    all() {
        return this.db.select();
    }
    find(id) {
        return this.db
            .first()
            .where({ id })
            .then((data) => (data ? data : Promise.reject(new Error('Content Not Found'))));
    }
    findBy(column, value) {
        return this.db
            .first()
            .where({ [column]: value })
            .then((data) => (data ? data : Promise.reject(new Error('Content Not Found'))));
    }
    insertGetId(data) {
        return this.db
            .insert(data)
            .returning('id')
            .then((ids) => ({ id: ids[0] }));
    }
    create(data) {
        return this.insertGetId(data);
    }
    update(data, whereClause) {
        const db = this.db.update(data);
        if (!whereClause)
            return db;
        return db.where(whereClause);
    }
    delete(id) {
        return this.db
            .where({ id })
            .delete()
            .then(() => ({ id }));
    }
    static newDefaultData(data) {
        return Object.assign(Object.assign({}, data), { createdAt: new Date() });
    }
}
exports.default = RestfModel;
function parseSingle(data) {
    if (!data)
        return data;
    const data2 = {};
    for (let field in data) {
        if (field.match('_')) {
            const [name, subName] = field.split('_');
            if (!data2[name])
                data2[name] = {};
            data2[name][subName] = data[field];
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

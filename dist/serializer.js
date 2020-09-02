"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RestfSerializer {
    constructor(controller = undefined) {
        this.controller = controller;
    }
    set(obj) {
        Object.entries(obj).forEach(([name, value]) => (this[name] = value));
    }
    get(path) {
        if (!/\./.test(path))
            return this[path];
        const paths = path.split('.');
        return this[paths[0]][paths[1]];
    }
    static use(method) {
        return new this()[method];
    }
    static staticfy(...methods) {
        methods.forEach(method => {
            ``;
            this[method] = (...args) => new this()[method](...args);
        });
    }
}
exports.default = RestfSerializer;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var knex = require("knex");
//TODO add , "../.." when as lib
// @ts-ignore
var fullPath = function (p) { return path.join(__dirname, '../..', p); };
var knexfile = getKnexfile();
// @ts-ignore
var environment = process.env.NODE_ENV || 'development';
function getKnexfile() {
    try {
        return require(fullPath('knexfile'));
    }
    catch (e) {
        return require(fullPath('config/knexfile'));
    }
}
// @ts-ignore
var _database = knex(knexfile[environment]);
exports.default = _database;
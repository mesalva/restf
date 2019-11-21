"use strict";
exports.__esModule = true;
var path = require("path");
var knex = require("knex");
//TODO add , "../.." when as lib
// @ts-ignore
var fullPath = function (p) { return path.join(__dirname, "../..", p); };
var knexfile = getKnexfile();
// @ts-ignore
var environment = process.env.NODE_ENV || "development";
function getKnexfile() {
    try {
        return require(fullPath("knexfile"));
    }
    catch (e) {
        return require(fullPath("config/knexfile"));
    }
}
// @ts-ignore
var database = knex(knexfile[environment]);
exports["default"] = database;

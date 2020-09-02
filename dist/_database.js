"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var knex = __importStar(require("knex"));
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

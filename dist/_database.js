"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const knex = __importStar(require("knex"));
//TODO add , "../.." when as lib
// @ts-ignore
const fullPath = (p) => path.join(__dirname, '../..', p);
const knexfile = getKnexfile();
// @ts-ignore
const environment = process.env.NODE_ENV || 'development';
function getKnexfile() {
    try {
        return require(fullPath('knexfile'));
    }
    catch (e) {
        return require(fullPath('config/knexfile'));
    }
}
// @ts-ignore
const _database = knex(knexfile[environment]);
exports.default = _database;

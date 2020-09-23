"use strict";var __assign=this&&this.__assign||function(){return(__assign=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)},__awaiter=this&&this.__awaiter||function(t,a,u,s){return new(u=u||Promise)(function(r,e){function n(t){try{i(s.next(t))}catch(t){e(t)}}function o(t){try{i(s.throw(t))}catch(t){e(t)}}function i(t){var e;t.done?r(t.value):((e=t.value)instanceof u?e:new u(function(t){t(e)})).then(n,o)}i((s=s.apply(t,a||[])).next())})},__generator=this&&this.__generator||function(r,n){var o,i,a,u={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},t={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(t[Symbol.iterator]=function(){return this}),t;function e(e){return function(t){return function(e){if(o)throw new TypeError("Generator is already executing.");for(;u;)try{if(o=1,i&&(a=2&e[0]?i.return:e[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,e[1])).done)return a;switch(i=0,a&&(e=[2&e[0],a.value]),e[0]){case 0:case 1:a=e;break;case 4:return u.label++,{value:e[1],done:!1};case 5:u.label++,i=e[1],e=[0];continue;case 7:e=u.ops.pop(),u.trys.pop();continue;default:if(!(a=0<(a=u.trys).length&&a[a.length-1])&&(6===e[0]||2===e[0])){u=0;continue}if(3===e[0]&&(!a||e[1]>a[0]&&e[1]<a[3])){u.label=e[1];break}if(6===e[0]&&u.label<a[1]){u.label=a[1],a=e;break}if(a&&u.label<a[2]){u.label=a[2],u.ops.push(e);break}a[2]&&u.ops.pop(),u.trys.pop();continue}e=n.call(r,u)}catch(t){e=[6,t],i=0}finally{o=a=0}if(5&e[0])throw e[1];return{value:e[0]?e[1]:void 0,done:!0}}([e,t])}}},__spreadArrays=this&&this.__spreadArrays||function(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;for(var n=Array(t),o=0,e=0;e<r;e++)for(var i=arguments[e],a=0,u=i.length;a<u;a++,o++)n[o]=i[a];return n},__importDefault=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0});var _database_1=__importDefault(require("./_database")),pg_1=require("pg"),RestfModel=function(){function t(t){this.options=t}return Object.defineProperty(t.prototype,"db",{get:function(){var n=this;if(this._db)return this._db;var o="string"==typeof this.options?this.options:"";return this.options||(o=this.route),this._db=_database_1.default(o),this._db.constructor.prototype.raw=function(e,r){return void 0===r&&(r=[]),__awaiter(n,void 0,void 0,function(){return __generator(this,function(t){return[2,_database_1.default.raw(e.replace(/\n/g," "),r).then(function(t){return t.rows})]})})},this._db.constructor.prototype.firstParsed=function(){for(var t,e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return(t=n._db).first.apply(t,e).then(parseSingle)},this._db.constructor.prototype.selectParsed=function(){for(var t,e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return(t=n._db).select.apply(t,e).then(parseMulti)},this._db.constructor.prototype.innerJoinWithManyAnds=function(t){for(var o=[],e=1;e<arguments.length;e++)o[e-1]=arguments[e];return n._db.innerJoin(t,function(){var t=o[0],e=o[1],r=o[2],n=o[3];this.on(t,"=",e).andOn(r,"=",n)})},this._db.constructor.insertReturning=function(t){for(var r=[],e=1;e<arguments.length;e++)r[e-1]=arguments[e];return n._db.insert(t).returning("id").then(function(t){return t[0]}).then(function(t){var e;return(e=_database_1.default(o).where({id:t})).first.apply(e,r)})},this._db},enumerable:!0,configurable:!0}),t.prototype.rawSelect=function(n,o){return void 0===o&&(o=[]),__awaiter(this,void 0,void 0,function(){var e,r;return __generator(this,function(t){switch(t.label){case 0:return[4,(e=new pg_1.Client({connectionString:process.env.DATABASE_URL+"?ssl=true"})).connect()];case 1:if(t.sent(),"select"!==n.toLowerCase().substr(0,6))throw new Error("Only selects are allowed");return[4,e.query(n,__spreadArrays(o))];case 2:return r=t.sent(),e.end(),[2,r.rows]}})})},t.prototype.rawSelectFirst=function(r,n){return __awaiter(this,void 0,void 0,function(){var e;return __generator(this,function(t){switch(t.label){case 0:return[4,this.rawSelect(r,n)];case 1:return(e=t.sent())&&Array.isArray(e)&&0<e.length?[2,e[0]]:[2,null]}})})},t.prototype.all=function(){return this._db.select()},t.prototype.find=function(t){return this._db.first().where({id:t}).then(function(t){return t||Promise.reject(new Error("Content Not Found"))})},t.prototype.findBy=function(t,e){var r;return this._db.first().where(((r={})[t]=e,r)).then(function(t){return t||Promise.reject(new Error("Content Not Found"))})},t.prototype.insertGetId=function(t){return this._db.insert(t).returning("id").then(function(t){return{id:t[0]}})},t.prototype.create=function(t){return this.insertGetId(t)},t.prototype.update=function(t,e){var r=this._db.update(t);return e?r.where(e):r},t.prototype.delete=function(t){return this._db.where({id:t}).delete().then(function(){return{id:t}})},t.newDefaultData=function(t){return __assign(__assign({},t),{createdAt:new Date})},t}();function parseSingle(t){if(!t)return t;var e,r,n,o={};for(var i in t){i.match("_")?(r=(e=i.split("_"))[0],n=e[1],o[r]||(o[r]={}),o[r][n]=t[i]):o[i]=t[i]}return o}function parseMulti(t){return t?t.map(parseSingle):t}exports.default=RestfModel;
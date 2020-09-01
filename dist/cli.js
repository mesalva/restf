#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var projectPath = __dirname;
if (projectPath.match(/node_modules\/(\.bin|restf)/))
    projectPath = projectPath.replace(/\/node_modules\/(\.bin|restf)/, '');
var _a = process.argv, args = _a.slice(2);
if (args[0] === 'dev')
    devCommand();
if (args[0] === 'build')
    buildCommand();
if (args[0] === 'build-dev')
    buildDevCommand();
if (args[0] === 'start')
    startCommand();
if (args[0] === 'postinstall' && process.env.NODE_ENV !== 'production')
    buildDevCommand();
function buildCommand() {
    var spawn = require('child_process').spawn;
    var command = spawn('gulp', ['build']);
    command.stdout.setEncoding('utf8');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
    command.stdout.on('end', function () {
        declareControllers('dist', args[1]);
        declareModels('dist');
    });
}
function buildDevCommand() {
    declareControllers();
    declareModels();
}
function devCommand() {
    buildDevCommand();
    var spawn = require('child_process').spawn;
    var command = spawn('ts-node', ['src/server.ts']);
    command.stdout.setEncoding('utf8');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
}
function startCommand() {
    var allControllers = fs.readFileSync(projectPath + "/node_modules/restf/.allControllers.js", 'utf8');
    var path = allControllers
        .replace(/\n/g, 'å')
        .replace(/å.*/g, '')
        .replace(/\/\/ (.+)/, '$1');
    var destiny = projectPath + "/dist";
    allControllers = allControllers
        .replace(new RegExp(path + "/(src|dist)", 'g'), destiny)
        .replace(new RegExp(path, 'g'), projectPath);
    fs.writeFileSync(projectPath + "/node_modules/restf/.allControllers.js", allControllers);
    var spawn = require('child_process').spawn;
    var command = spawn('node', ['dist/server.js']);
    command.stdout.setEncoding('utf8');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
}
function declareControllers(folderPath, repoPath) {
    if (folderPath === void 0) { folderPath = 'src'; }
    if (repoPath === void 0) { repoPath = projectPath; }
    var controllersFolderPath = projectPath + "/" + folderPath + "/controllers";
    if (!fs.existsSync(controllersFolderPath)) {
        return fs.writeFileSync(projectPath + "/node_modules/restf/.allControllers.js", 'module.exports = {}');
    }
    var files = fs
        .readdirSync(controllersFolderPath)
        .filter(function (file) { return file.match(/^[A-Z].*\.[tj]s$/); })
        .filter(function (file) { return !file.match(/\.(d|test|spec)\.[tj]s$/); })
        .map(function (file) { return file.replace(/\.[tj]s$/, ''); });
    var content = "// " + repoPath + "\n\nmodule.exports = {\n";
    content += files
        .map(function (controller) { return "  " + controller + ": require('" + repoPath + "/" + folderPath + "/controllers/" + controller + "').default,"; })
        .join('\n');
    content += '\n}';
    fs.writeFileSync(projectPath + "/node_modules/restf/.allControllers.js", content);
}
function declareModels(folderPath) {
    if (folderPath === void 0) { folderPath = 'src'; }
    var path = function (name) { return projectPath + "/" + folderPath + "/" + name; };
    var doNotExists = function (name) {
        return !fs.existsSync(path(name));
    };
    if (doNotExists("controllers") || doNotExists("models"))
        return null;
    var files = fs
        .readdirSync(path('models'))
        .filter(function (file) { return file.match(/[A-Z].*\.[tj]s$/); })
        .filter(function (file) { return !file.match(/\.(d|test|spec)\.[tj]s$/); })
        .map(function (file) { return file.replace(/\.[tj]s$/, ''); })
        .filter(function (file) { return !file.match(/^(DB|ModelBase|DBBase|Model|Api|Search|SearchBase)$/); });
    var content = mountDeclareModelsContent(files, folderPath);
    fs.writeFileSync(projectPath + "/node_modules/restf/.ControllerModels.js", content.js);
    fs.writeFileSync(projectPath + "/node_modules/restf/.ControllerModels.d.ts", content.declaration);
}
function mountDeclareModelsContent(files, folderPath) {
    var js = "\"use strict\";\n";
    js += files.map(function (model) { return "const " + model + " = require('../../" + folderPath + "/models/" + model + "').default"; }).join('\n');
    js += '\n\n\nvar ControllerModels = /** @class */ (function () {\n  function ControllerModels() {}\n';
    js += files
        .map(function (model) {
        return "  Object.defineProperty(ControllerModels.prototype, \"" + model + "\", {\n    get: function () {\n      const model = new " + model + "()\n      if(typeof model.authenticate === 'function') model.authenticate(this.currentUser || {})\n      return model\n    },\n    enumerable: true,\n    configurable: true\n  });\n";
    })
        .join('\n');
    js += '  return ControllerModels;\n}());\nexports.default = ControllerModels;';
    var declaration = files.map(function (model) { return "import { I" + model + " } from '../../" + folderPath + "/models/" + model + "'\n"; }).join('');
    declaration += '\nexport default class ControllerModels {\n';
    declaration += files.map(function (model) { return "  protected get " + model + "(): I" + model + ";\n"; }).join('');
    declaration += '}\n';
    return { js: js, declaration: declaration };
}

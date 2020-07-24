"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var projectPath = "" + process.cwd();
if (projectPath.match(/node_modules\/restf/))
    projectPath = projectPath.replace('/node_modules/restf', '');
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
    var content = 'module.exports = {\n';
    content += files
        .map(function (controller) { return "  " + controller + ": require('" + repoPath + "/" + folderPath + "/controllers/" + controller + "').default,"; })
        .join('\n');
    content += '\n}';
    fs.writeFileSync(projectPath + "/node_modules/restf/.allControllers.js", content);
}
exports.declareControllers = declareControllers;
function declareModels(folderPath) {
    if (folderPath === void 0) { folderPath = 'src'; }
    var path = function (name) { return projectPath + "/" + folderPath + "/" + name; };
    var doNotExists = function (name) { return !fs.existsSync(path(name)); };
    if (doNotExists("controllers") || doNotExists("models"))
        return null;
    var files = fs
        .readdirSync(path('models'))
        .filter(function (file) { return file.match(/[A-Z].*\.[tj]s$/); })
        .filter(function (file) { return !file.match(/\.d\.[tj]s$/); })
        .map(function (file) { return file.replace(/\.[tj]s$/, ''); })
        .filter(function (file) { return !file.match(/^(DB|ModelBase|DBBase|Model|Api)$/); });
    var content = mountDeclareModelsContent(files);
    return fs.writeFileSync(path('controllers') + "/_RestfControllerWithModels.ts", content);
}
exports.declareModels = declareModels;
function mountDeclareModelsContent(files) {
    var content = "//######################################\n";
    content += '// This file is generated automatically,\n';
    content += "// Don't modify this file\n";
    content += "//######################################\n";
    content += "import RestfController from 'restf/controller'\n";
    content += files.map(function (model) { return "import " + model + " from '../models/" + model + "'"; }).join('\n');
    content += '\n\nexport default class RestfControllerWithModels extends RestfController {\n';
    content += files.map(function (model) { return "  public get " + model + "() {\n    return new " + model + "(this.currentUser || {})\n  }"; }).join('\n');
    return content + '\n}\n';
}

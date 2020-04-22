"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function declareControllers(folderPath, repoPath) {
    if (folderPath === void 0) { folderPath = 'src'; }
    if (repoPath === void 0) { repoPath = undefined; }
    if (!repoPath)
        repoPath = process.cwd();
    var controllersFolderPath = process.cwd() + "/" + folderPath + "/controllers";
    if (controllersFolderPath.match(/node_modules\/restf/))
        controllersFolderPath = controllersFolderPath.replace('node_modules/restf/', '');
    if (!fs.existsSync(controllersFolderPath)) {
        console.log('install .allControllers 1, do not exists', controllersFolderPath);
        return fs.writeFileSync(process.cwd() + "/node_modules/restf/.allControllers.js", 'module.exports = {}');
    }
    console.log('install .allControllers 2');
    var files = fs
        .readdirSync(controllersFolderPath)
        .filter(function (file) { return file.match(/^[A-Z].*\.[tj]s$/); })
        .map(function (file) { return file.replace(/\.[tj]s$/, ''); });
    var content = 'module.exports = {\n';
    content += files
        .map(function (controller) { return "  " + controller + ": require('" + repoPath + "/" + folderPath + "/controllers/" + controller + "').default,"; })
        .join('\n');
    content += '\n}';
    fs.writeFileSync(process.cwd() + "/node_modules/restf/.allControllers.js", content);
}
exports.declareControllers = declareControllers;
function declareModels(folderPath) {
    if (folderPath === void 0) { folderPath = 'src'; }
    var path = function (name) {
        var str = process.cwd() + "/" + folderPath + "/" + name;
        if (str.match(/node_modules\/restf/))
            str = str.replace('node_modules/restf/', '');
        return str;
    };
    var doNotExists = function (name) { return !fs.existsSync(path(name)); };
    if (doNotExists("controllers") || doNotExists("models"))
        return null;
    var files = fs
        .readdirSync(path('models'))
        .filter(function (file) { return file.match(/[A-Z].*\.[tj]s$/); })
        .map(function (file) { return file.replace(/\.[tj]s$/, ''); })
        .filter(function (file) { return !file.match(/^(DB|ModelBase|DBBase|Model|Api)$/); });
    var content = mountDeclareModelsContent(files);
    return fs.writeFileSync(path('controllers') + "/.RestfControllerWithModels.ts", content);
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
    content += "  private get modelCredentials() {\n";
    content += "    return this.req.credentials || {}\n";
    content += '  }\n';
    content += files
        .map(function (model) { return "  public get " + model + "() {\n    return new " + model + "(this.modelCredentials)\n  }"; })
        .join('\n');
    return content + '\n}\n';
}

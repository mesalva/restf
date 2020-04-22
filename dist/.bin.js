"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function declareControllers(folderPath, repoPath) {
    if (folderPath === void 0) { folderPath = 'src'; }
    if (repoPath === void 0) { repoPath = undefined; }
    if (!repoPath)
        repoPath = process.cwd();
    var controllersFolderPath = process.cwd() + "/" + folderPath + "/controllers";
    if (!fs.existsSync(controllersFolderPath)) {
        return fs.writeFileSync(repoPath + "/node_modules/restf/.allControllers.js", 'module.exports = {}');
    }
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
    var controllersFolderPath = process.cwd() + "/" + folderPath + "/controllers";
    if (!fs.existsSync(controllersFolderPath)) {
        return fs.writeFileSync(controllersFolderPath + "/.models.ts", "import RestfModel from 'restf/model'\n\nexport default class _Model extends RestfModel {\n}\n");
    }
    var files = fs
        .readdirSync(process.cwd() + "/" + folderPath + "/models")
        .filter(function (file) { return file.match(/[A-Z].*\.[tj]s$/); })
        .map(function (file) { return file.replace(/\.[tj]s$/, ''); })
        .filter(function (file) { return !file.match(/^(DB|ModelBase|DBBase|Model|Api)$/); });
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
    content += '\n}\n';
    return fs.writeFileSync(controllersFolderPath + "/.RestfControllerWithModels.ts", content);
}
exports.declareModels = declareModels;

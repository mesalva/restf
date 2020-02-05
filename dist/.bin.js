"use strict";
exports.__esModule = true;
var fs = require("fs");
function declareControllers(folderPath, repoPath) {
    if (folderPath === void 0) { folderPath = 'src'; }
    if (repoPath === void 0) { repoPath = undefined; }
    var controllersFolderPath = process.cwd() + "/" + folderPath + "/controllers";
    if (!fs.existsSync(controllersFolderPath)) {
        return fs.writeFileSync(repoPath + "/node_modules/restf/.allControllers.js", 'module.exports = {}');
    }
    var files = fs
        .readdirSync(controllersFolderPath)
        .filter(function (file) { return file.match(/[A-Z].*\.[tj]s$/); })
        .map(function (file) { return file.replace(/\.[tj]s$/, ''); });
    var content = 'module.exports = {\n';
    content += files
        .map(function (controllerName) { return "  " + controllerName + ": require('" + repoPath + "/" + folderPath + "/controllers/" + controllerName + "').default,"; })
        .join('\n');
    content += '\n}';
    fs.writeFileSync(process.cwd() + "/node_modules/restf/.allControllers.js", content);
}
exports.declareControllers = declareControllers;

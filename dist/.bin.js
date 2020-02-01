"use strict";
exports.__esModule = true;
var fs = require("fs");
function declareControllers(folderPath) {
    if (folderPath === void 0) { folderPath = 'src'; }
    var controllersFolderPath = process.cwd() + "/" + folderPath + "/controllers";
    if (!fs.existsSync(controllersFolderPath)) {
        return fs.writeFileSync(__dirname + "/.allControllers.js", 'export {}');
    }
    var files = fs
        .readdirSync(controllersFolderPath)
        .filter(function (file) { return file.match(/[A-Z].*\.[tj]s$/); })
        .map(function (file) { return file.replace(/\.[tj]s$/, ''); });
    var content = 'module.exports = {\n';
    content += files
        .map(function (controllerName) { return "  " + controllerName + ": require('" + controllersFolderPath + "/" + controllerName + "').default,"; })
        .join('\n');
    content += '\n}';
    fs.writeFileSync(__dirname + "/.allControllers.js", content);
}
exports.declareControllers = declareControllers;

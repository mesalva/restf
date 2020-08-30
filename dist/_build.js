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
    var content = "// " + repoPath + "\n// dois\nmodule.exports = {\n";
    content += files
        .map(function (controller) { return "  " + controller + ": require('" + repoPath + "/" + folderPath + "/controllers/" + controller + "').default,"; })
        .join('\n');
    content += '\n}';
    fs.writeFileSync(projectPath + "/node_modules/restf/.allControllers.js", content);
}
exports.declareControllers = declareControllers;
declareControllers(process.argv[2], process.argv[3]);

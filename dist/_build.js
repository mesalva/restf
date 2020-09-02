"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
let projectPath = `${process.cwd()}`;
if (projectPath.match(/node_modules\/restf/))
    projectPath = projectPath.replace('/node_modules/restf', '');
function declareControllers(folderPath = 'src', repoPath = projectPath) {
    let controllersFolderPath = `${projectPath}/${folderPath}/controllers`;
    if (!fs.existsSync(controllersFolderPath)) {
        return fs.writeFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, 'module.exports = {}');
    }
    const files = fs
        .readdirSync(controllersFolderPath)
        .filter(file => file.match(/^[A-Z].*\.[tj]s$/))
        .filter(file => !file.match(/\.(d|test|spec)\.[tj]s$/))
        .map(file => file.replace(/\.[tj]s$/, ''));
    let content = `// ${repoPath}\n// dois\nmodule.exports = {\n`;
    content += files
        .map(controller => `  ${controller}: require('${repoPath}/${folderPath}/controllers/${controller}').default,`)
        .join('\n');
    content += '\n}';
    fs.writeFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, content);
}
exports.declareControllers = declareControllers;
declareControllers(process.argv[2], process.argv[3]);

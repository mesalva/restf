"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.declareControllers = void 0;
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

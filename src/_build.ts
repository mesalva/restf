import * as fs from 'fs'

let projectPath = `${process.cwd()}`
if (projectPath.match(/node_modules\/restf/)) projectPath = projectPath.replace('/node_modules/restf', '')

export function declareControllers(folderPath = 'src', repoPath = projectPath) {
  let controllersFolderPath = `${projectPath}/${folderPath}/controllers`
  if (!fs.existsSync(controllersFolderPath)) {
    return fs.writeFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, 'module.exports = {}')
  }
  const files = fs
    .readdirSync(controllersFolderPath)
    .filter(file => file.match(/^[A-Z].*\.[tj]s$/))
    .filter(file => !file.match(/\.(d|test|spec)\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
  let content = `// ${repoPath}\n// dois\nmodule.exports = {\n`
  content += files
    .map(controller => `  ${controller}: require('${repoPath}/${folderPath}/controllers/${controller}').default,`)
    .join('\n')
  content += '\n}'
  fs.writeFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, content)
}

declareControllers(process.argv[2], process.argv[3])

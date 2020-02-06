import * as fs from 'fs'

export function declareControllers(folderPath = 'src', repoPath = undefined) {
  if (!repoPath) repoPath = process.cwd()
  const controllersFolderPath = `${process.cwd()}/${folderPath}/controllers`
  if (!fs.existsSync(controllersFolderPath)) {
    return fs.writeFileSync(`${repoPath}/node_modules/restf/.allControllers.js`, 'module.exports = {}')
  }
  const files = fs
    .readdirSync(controllersFolderPath)
    .filter(file => file.match(/[A-Z].*\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
  let content = 'module.exports = {\n'
  content += files
    .map(
      controllerName =>
        `  ${controllerName}: require('${repoPath}/${folderPath}/controllers/${controllerName}').default,`
    )
    .join('\n')
  content += '\n}'
  fs.writeFileSync(`${process.cwd()}/node_modules/restf/.allControllers.js`, content)
}

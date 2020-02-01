import * as fs from 'fs'

export function declareControllers(folderPath = 'src') {
  const controllersFolderPath = `${process.cwd()}/${folderPath}/controllers`
  if (!fs.existsSync(controllersFolderPath)) {
    return fs.writeFileSync(`${__dirname}/.allControllers.js`, 'export {}')
  }
  const files = fs
    .readdirSync(controllersFolderPath)
    .filter(file => file.match(/[A-Z].*\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
  let content = 'module.exports = {\n'
  content += files
    .map(controllerName => `  ${controllerName}: require('${controllersFolderPath}/${controllerName}').default,`)
    .join('\n')
  content += '\n}'
  fs.writeFileSync(`${__dirname}/.allControllers.js`, content)
}

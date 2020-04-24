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
    .filter(file => !file.match(/\.d\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
  let content = 'module.exports = {\n'
  content += files
    .map(controller => `  ${controller}: require('${repoPath}/${folderPath}/controllers/${controller}').default,`)
    .join('\n')
  content += '\n}'
  fs.writeFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, content)
}
export function declareModels(folderPath = 'src') {
  const path = name => `${projectPath}/${folderPath}/${name}`
  const doNotExists = name => !fs.existsSync(path(name))
  if (doNotExists(`controllers`) || doNotExists(`models`)) return null
  const files = fs
    .readdirSync(path('models'))
    .filter(file => file.match(/[A-Z].*\.[tj]s$/))
    .filter(file => !file.match(/\.d\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
    .filter(file => !file.match(/^(DB|ModelBase|DBBase|Model|Api)$/))
  let content = mountDeclareModelsContent(files)
  return fs.writeFileSync(`${path('controllers')}/.RestfControllerWithModels.ts`, content)
}

function mountDeclareModelsContent(files) {
  let content = `//######################################\n`
  content += '// This file is generated automatically,\n'
  content += "// Don't modify this file\n"
  content += `//######################################\n`
  content += `import RestfController from 'restf/controller'\n`
  content += files.map(model => `import ${model} from '../models/${model}'`).join('\n')
  content += '\n\nexport default class RestfControllerWithModels extends RestfController {\n'
  content += files.map(model => `  public get ${model}() {\n    return new ${model}(this.currentUser || {})\n  }`).join('\n')
  return content + '\n}\n'
}

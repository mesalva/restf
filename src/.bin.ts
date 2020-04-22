import * as fs from 'fs'

export function declareControllers(folderPath = 'src', repoPath = undefined) {
  if (!repoPath) repoPath = process.cwd()
  let controllersFolderPath = `${process.cwd()}/${folderPath}/controllers`
  if (controllersFolderPath.match(/node_modules\/restf/))
    controllersFolderPath = controllersFolderPath.replace('node_modules/restf/', '')
  if (!fs.existsSync(controllersFolderPath)) {
    console.log('install .allControllers 1, do not exists', controllersFolderPath)
    return fs.writeFileSync(`${process.cwd()}/node_modules/restf/.allControllers.js`, 'module.exports = {}')
  }
  console.log('install .allControllers 2')
  const files = fs
    .readdirSync(controllersFolderPath)
    .filter(file => file.match(/^[A-Z].*\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
  let content = 'module.exports = {\n'
  content += files
    .map(controller => `  ${controller}: require('${repoPath}/${folderPath}/controllers/${controller}').default,`)
    .join('\n')
  content += '\n}'
  fs.writeFileSync(`${process.cwd()}/node_modules/restf/.allControllers.js`, content)
}
export function declareModels(folderPath = 'src') {
  const path = name => {
    let str = `${process.cwd()}/${folderPath}/${name}`
    if (str.match(/node_modules\/restf/)) str = str.replace('node_modules/restf/', '')
    return str
  }
  const doNotExists = name => !fs.existsSync(path(name))
  if (doNotExists(`controllers`) || doNotExists(`models`)) return null
  const files = fs
    .readdirSync(path('models'))
    .filter(file => file.match(/[A-Z].*\.[tj]s$/))
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
  content += `  private get modelCredentials() {\n`
  content += `    return this.req.credentials || {}\n`
  content += '  }\n'
  content += files
    .map(model => `  public get ${model}() {\n    return new ${model}(this.modelCredentials)\n  }`)
    .join('\n')
  return content + '\n}\n'
}

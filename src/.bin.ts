import * as fs from 'fs'

export function declareControllers(folderPath = 'src', repoPath = undefined) {
  if (!repoPath) repoPath = process.cwd()
  const controllersFolderPath = `${process.cwd()}/${folderPath}/controllers`
  if (!fs.existsSync(controllersFolderPath)) {
    return fs.writeFileSync(`${repoPath}/node_modules/restf/.allControllers.js`, 'module.exports = {}')
  }
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
  const controllersFolderPath = `${process.cwd()}/${folderPath}/controllers`
  if (!fs.existsSync(controllersFolderPath)) {
    return fs.writeFileSync(
      `${controllersFolderPath}/.models.ts`,
      `import RestfModel from 'restf/model'\n\nexport default class _Model extends RestfModel {\n}\n`
    )
  }
  const files = fs
    .readdirSync(`${process.cwd()}/${folderPath}/models`)
    .filter(file => file.match(/[A-Z].*\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
    .filter(file => !file.match(/^(DB|ModelBase|DBBase|Model|Api)$/))
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
  content += '\n}\n'
  return fs.writeFileSync(`${controllersFolderPath}/.RestfControllerWithModels.ts`, content)
}

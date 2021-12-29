#!/usr/bin/env node
import * as fs from 'fs'

let projectPath = __dirname
if (projectPath.match(/node_modules\/(\.bin|restf)/))
  projectPath = projectPath.replace(/\/node_modules\/(\.bin|restf)/, '')

const [, , ...args] = process.argv
if (args[0] === 'dev') devCommand()
if (args[0] === 'build') buildCommand()
if (args[0] === 'build-dev') buildDevCommand()
if (args[0] === 'start') startCommand()
if (args[0] === 'postinstall' && process.env.NODE_ENV !== 'production') buildDevCommand()

function buildCommand() {
  const { spawn } = require('child_process')

  const command = spawn('gulp', ['build'])
  command.stdout.setEncoding('utf8')
  command.stdout.on('data', data => process.stdout.write(data))
  command.stdout.on('end', () => {
    declareControllers('dist', args[1])
    declareModels('dist')
  })
}

function buildDevCommand() {
  declareControllers()
  declareModels()
}

function devCommand() {
  buildDevCommand()
  const spawn = require('child_process').spawn
  const command = spawn('ts-node', ['--transpile-only','src/server.ts'])
  command.stdout.setEncoding('utf8')
  command.stdout.on('data', data => process.stdout.write(data))
}

function startCommand() {
  let allControllers = fs.readFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, 'utf8')
  const path = allControllers
    .replace(/\n/g, 'å')
    .replace(/å.*/g, '')
    .replace(/\/\/ (.+)/, '$1')
  const destiny = `${projectPath}/dist`
  allControllers = allControllers
    .replace(new RegExp(`${path}/(src|dist)`, 'g'), destiny)
    .replace(new RegExp(path, 'g'), projectPath)
  fs.writeFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, allControllers)
  const spawn = require('child_process').spawn
  const command = spawn('node', ['dist/server.js'])
  command.stdout.setEncoding('utf8')
  command.stdout.on('data', data => process.stdout.write(data))
}

function declareControllers(folderPath = 'src', repoPath = projectPath) {
  let controllersFolderPath = `${projectPath}/${folderPath}/controllers`
  if (!fs.existsSync(controllersFolderPath)) {
    return fs.writeFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, 'module.exports = {}')
  }
  const files = fs
    .readdirSync(controllersFolderPath)
    .filter(file => file.match(/^[A-Z].*\.[tj]s$/))
    .filter(file => !file.match(/\.(d|test|spec)\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
  let content = `// ${repoPath}\n\nmodule.exports = {\n`
  content += files
    .map(controller => `  ${controller}: require('${repoPath}/${folderPath}/controllers/${controller}').default,`)
    .join('\n')
  content += '\n}'
  fs.writeFileSync(`${projectPath}/node_modules/restf/.allControllers.js`, content)
}
function declareModels(folderPath = 'src') {
  const path = name => `${projectPath}/${folderPath}/${name}`
  const doNotExists = name => {
    return !fs.existsSync(path(name))
  }
  if (doNotExists(`controllers`) || doNotExists(`models`)) return null
  const files = fs
    .readdirSync(path('models'))
    .filter(file => file.match(/[A-Z].*\.[tj]s$/))
    .filter(file => !file.match(/\.(d|test|spec)\.[tj]s$/))
    .map(file => file.replace(/\.[tj]s$/, ''))
    .filter(file => !file.match(/^(DB|ModelBase|DBBase|Model|Api|Search|SearchBase|\.base\.)$/))
  let content = mountDeclareModelsContent(files, folderPath)
  fs.writeFileSync(`${projectPath}/node_modules/restf/.ControllerModels.js`, content.js)
  fs.writeFileSync(`${projectPath}/node_modules/restf/.ControllerModels.d.ts`, content.declaration)
}

function mountDeclareModelsContent(files, folderPath) {
  let js = `"use strict";\n`
  js += files.map(model => `const ${model} = require('../../${folderPath}/models/${model}').default`).join('\n')
  js += '\n\n\nvar ControllerModels = /** @class */ (function () {\n  function ControllerModels() {}\n'
  js += files
    .map(model => {
      return `  Object.defineProperty(ControllerModels.prototype, "${model}", {\n    get: function () {
      const model = new ${model}(this.headers)
      if(typeof model.authenticate === 'function') model.authenticate(this.currentUser || {})
      return model
    },
    enumerable: true,
    configurable: true
  });\n`
    })
    .join('\n')
  js += '  return ControllerModels;\n}());\nmodule.exports = ControllerModels;'
  let declaration = files.map(model => `import { I${model} } from '../../${folderPath}/models/${model}'\n`).join('')
  declaration += '\nexport default class ControllerModels {\n'
  declaration += files.map(model => `  protected get ${model}(): I${model};\n`).join('')
  declaration += '}\n'
  return { js, declaration }
}

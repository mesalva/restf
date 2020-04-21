#!/usr/bin/env node
import { declareControllers } from './.bin'

const [, , ...args] = process.argv

if (args[0] === 'dev') {
  declareControllers()
  const spawn = require('child_process').spawn
  const command = spawn('ts-node', ['src/server.ts'])
  command.stdout.setEncoding('utf8')
  command.stdout.on('data', data => process.stdout.write(data))
}
if (args[0] === 'build') {
  declareControllers('dist', args[1] || process.cwd())
}
if (args[0] === 'start') {
  const spawn = require('child_process').spawn
  const command = spawn('node', ['dist/server.ts'])
  command.stdout.setEncoding('utf8')
  command.stdout.on('data', data => process.stdout.write(data))
}

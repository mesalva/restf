#!/usr/bin/env node
import { declareControllers, declareModels } from './.bin'

const [, , ...args] = process.argv

if (args[0] === 'dev') devCommand()
if (args[0] === 'build') buildCommand()
if (args[0] === 'build-dev') buildDevCommand()
if (args[0] === 'start') startCommand()

function buildCommand() {
  declareControllers('dist', args[1])
  declareModels('dist')
}

function buildDevCommand() {
  declareControllers()
  declareModels()
}

function devCommand() {
  buildDevCommand()
  const spawn = require('child_process').spawn
  const command = spawn('ts-node', ['src/server.ts'])
  command.stdout.setEncoding('utf8')
  command.stdout.on('data', data => process.stdout.write(data))
}

function startCommand() {
  const spawn = require('child_process').spawn
  const command = spawn('node', ['dist/server.ts'])
  command.stdout.setEncoding('utf8')
  command.stdout.on('data', data => process.stdout.write(data))
}

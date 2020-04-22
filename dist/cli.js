#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _bin_1 = require("./.bin");
var _a = process.argv, args = _a.slice(2);
if (args[0] === 'dev')
    devCommand();
if (args[0] === 'build')
    buildCommand();
if (args[0] === 'build-dev')
    buildDevCommand();
if (args[0] === 'start')
    startCommand();
function buildCommand() {
    _bin_1.declareControllers('dist', args[1]);
    _bin_1.declareModels('dist');
}
function buildDevCommand() {
    _bin_1.declareControllers();
    _bin_1.declareModels();
}
function devCommand() {
    buildDevCommand();
    var spawn = require('child_process').spawn;
    var command = spawn('ts-node', ['src/server.ts']);
    command.stdout.setEncoding('utf8');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
}
function startCommand() {
    var spawn = require('child_process').spawn;
    var command = spawn('node', ['dist/server.ts']);
    command.stdout.setEncoding('utf8');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
}

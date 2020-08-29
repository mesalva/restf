#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _bin_1 = require("./_bin");
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
    var spawn = require('child_process').spawn;
    var command = spawn('gulp', ['build']);
    command.stdout.setEncoding('utf8');
    process.stdout.write('Running project build\n');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
    command.stdout.on('end', function () {
        _bin_1.declareControllers('dist', args[1]);
        _bin_1.declareModels('dist');
    });
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
    var command = spawn('node', ['dist/server.js']);
    command.stdout.setEncoding('utf8');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
}

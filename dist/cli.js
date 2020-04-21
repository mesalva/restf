#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var _bin_1 = require("./.bin");
var _a = process.argv, args = _a.slice(2);
if (args[0] === 'dev') {
    _bin_1.declareControllers();
    var spawn = require('child_process').spawn;
    var command = spawn('ts-node', ['src/server.ts']);
    command.stdout.setEncoding('utf8');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
}
if (args[0] === 'build') {
    _bin_1.declareControllers('dist', args[1] || process.cwd());
}
if (args[0] === 'start') {
    var spawn = require('child_process').spawn;
    var command = spawn('node', ['dist/server.ts']);
    command.stdout.setEncoding('utf8');
    command.stdout.on('data', function (data) { return process.stdout.write(data); });
}

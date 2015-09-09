var path    = require('path'),
    colors  = require('colors'),
    Promise = require('bluebird'),
    _       = require('lodash'),
    argv    = require('minimist')(process.argv.slice(2));

// Promisify FS
var fs = Promise.promisifyAll(require('fs'));

// Constants
const __BASEDIR = process.cwd();
const __JSPMDIR = path.resolve(__BASEDIR, 'jspm_packages');

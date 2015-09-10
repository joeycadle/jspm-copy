var path    = require('path'),
    colors  = require('colors'),
    Promise = require('bluebird'),
    _       = require('lodash'),
    argv    = require('minimist')(process.argv.slice(2)),
    exec    = require('child_process').exec,
    getdir  = require('jspm-getdir');

// Promisify FS
var fs = Promise.promisifyAll(require('fs'));

// Constants
const __BASEDIR = process.cwd();
const __JSPMDIR = path.resolve(__BASEDIR, 'jspm_packages');

// Checks arguments and ensures there's enuff ;]
function _validate_arguments() {
  var err = function(arg) {
    console.log(colors.red("JSPM-Copy: ") + colors.bold(arg) + " is a required argument!");
    process.abort();
  };

  if (!argv.to) err("to");
  if (!argv.from) err("from");
  if (!argv.pkg) err("pkg");
};

// Returns a path based on a package and the 'from' param.
function _full_dir(pkg_base, pkg_from) {
  return path.join(pkg_base, pkg_from);
};

function _run() {
  var cmd = (argv.R) ? 'cp -R ' : 'cp ',
      from_dir = getdir(argv.pkg);

  cmd += _full_dir(from_dir, argv.from) + ' ' + argv.to;

  console.log(colors.yellow("JSPM-Copy: ") + "running copy on jspm package - " + colors.bold(cmd));

  exec(cmd, function(error, stdout, stderr) {
    var err = function(exec_cmd) {
      console.log(colors.red("JSPM-Copy: ") + "unable to copy jspm package via " + colors.bold(exec_cmd));
      process.abort();
    };

    if (error) {
      console.log(err);
      err(cmd);
    }

    if (stderr) {
      console.log(stderr);
      err(cmd);
    }

    console.log(stdout);
  });
};

// Run this junk.
exports.run = function () {
  _run();
};

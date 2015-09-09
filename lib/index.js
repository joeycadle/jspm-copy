var path    = require('path'),
    colors  = require('colors'),
    Promise = require('bluebird'),
    _       = require('lodash'),
    argv    = require('minimist')(process.argv.slice(2)),
    exec    = require('child_process').exec;

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

// Returns a path based on a jspm package
function _join_dir(pkg) {
  return path.join(__JSPMDIR, pkg.replace(':', '/'));
};

// Returns a path based on a package and the 'from' param.
function _full_dir(pkg_base, pkg_from) {
  return path.join(pkg_base, pkg_from);
};

// Most current directory
function _mcur_dir(pkg) {
  var semver    = [],
      pkg_name  = _.last(pkg.split('/')),
      pkg_root  = path.join(__JSPMDIR, pkg.split(':')[0], pkg.split(':')[1].split('/')[0]),
      pkg_path  = path.join(pkg_root, pkg_name),
      dir_names = fs.readdirSync(pkg_root);

  _(dir_names).forEach(function(dir) {
    var stat_path = path.join(pkg_root, dir),
        stat_info = fs.lstatSync(stat_path);

    if (stat_info.isDirectory() && dir[0] !== '.') {
      var c_ver  = stat_path.split('@')[1],
          c_name = _.last(stat_path.split('@')[0].split('/'));

      if (c_name == pkg_name) {
        semver.push(c_ver);
      }
    }
  }).value();

  return pkg_path + '@' + _.last(_.sortBy(semver));
};

function _run() {
  var cmd = (argv.R) ? 'cp -R ' : 'cp ',
      from_dir = (argv.pkg.split('@')[1]) ? _join_dir(argv.pkg) : _mcur_dir(argv.pkg);

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

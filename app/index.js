var fs = require('fs');
var path = require('path');
var os = require('os');
var fsx = require('fs-extra');
var arch = os.platform();

var spawn = require('child_process').spawn;
var apiDir, apiAssets, flags;

if(arch === 'win32') {
  apiDir = __dirname + '\\doc\\api\\';
  apiAssets = __dirname + '\\doc\\api_assets\\';
  flags = [__dirname + '\\doc\\tools\\doc\\generate.js', '--template=' + __dirname + '\\doc\\template.html', ''];
  docEnd = '\\';
} else if(arch === 'darwin' || arch === 'linux') {
  apiDir = __dirname + '/doc/api/';
  apiAssets = __dirname + '/doc/api_assets/';
  flags = [__dirname + '/doc/tools/doc/generate.js', '--template=' + __dirname + '/doc/template.html', ''];
  docEnd = '/';
}

var count = 0;

var child;

var buildOptions = {
  buildDir: process.cwd(),
  buildVersion: process.version.slice(1),
  buildName: 'node-documents',
  updateApi: true
}

// Check for modular options
function convertFile(file) {
  // take file and generate html file
  count++;
  flags[2] = apiDir + file;
  var filename = file.slice(0,-3);
  var pathname = buildOptions.buildDir + filename + '.html';
  var fileStream = fs.createWriteStream(pathname, {flag: 'w'});
  var createFile = spawn('node', flags);
  createFile.stdout.pipe(fileStream);
  createFile.on('error', (err) => console.error('NODe: Error writing: ', err));
}

// grab template file and assets
function checkFiles() {
  fs.readdir(apiDir, function(err, res) {
    var ext = path.extname('*.md');
    if (err) { console.error(err.stack); }
    res.forEach((file) => {
      if (path.extname(file) === ext) { convertFile(file); }
    });
  });
}

// copy document assets
function copyAssets() {
  fsx.copy(apiAssets, buildOptions.buildDir + 'assets', function(err) {
    // Quiet this error since it will show if assets already exist
    if (err) { return console.log('NODe: Error copying assets:', err); }
  });
  checkFiles();
}

// create document directories
function checkFolders() {
  fs.stat(buildOptions.buildDir, function(err, out) {
    if (out) {
      fs.stat(buildOptions.buildDir + 'assets', function(err, out) { 
        if (err || buildOptions.updateApi) { copyAssets(); }
      });
    } else {
      fs.mkdir(buildOptions.buildDir, (err, out) => {
        copyAssets();
      });
    }
  });
}

function checkOptions() {
  flags[3] = '--node-version=' + buildOptions.buildVersion;
  if(buildOptions.buildDir.slice(0,1)) { buildOptions.buildDir = buildOptions.buildDir.replace(/^~/, os.homedir); }
  if (buildOptions.buildDir.slice(-1) !== docEnd) { buildOptions.buildDir += docEnd; }
  buildOptions.buildDir += buildOptions.buildName + docEnd;
  checkFolders();
}

function createDocs() {
  checkOptions();
}

module.exports = {
  createDocs: createDocs,
  buildOptions: buildOptions,
  documentPath: buildOptions.buildDir
}
// var fs = require('fs');
var path = require('path');
var os = require('os');
var fs = require('fs-extra');
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

function updateOptions(args) {
  var buildOptions = {
    buildDir: args[0] || process.cwd(),
    buildName: args[1] || 'node-documents',
    buildVersion: args[2] || process.version.slice(1),
    updateApi: args[3] || true
  }
  checkOptions(buildOptions);
}

// Check for modular options
function convertFile(file, buildOptions) {
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
function checkFiles(buildOptions) {
  var ext = path.extname('*.md');
  fs.readdir(apiDir, function(err, res) {
    if (err) { console.error(err.stack); }
    res.forEach((file) => {
      if (path.extname(file) === ext) { convertFile(file, buildOptions); }
    });
  });
}

// copy document assets
function copyAssets(buildOptions) {
  fs.mkdir(buildOptions.buildDir + 'assets', function (err, out) {
    fs.copy(apiAssets, buildOptions.buildDir + 'assets', function(err) {
      if (err) { return console.error('NODe: Error copying assets:', err); }
      // Quiet this error since it will show if assets already exist
    });
    checkFiles(buildOptions);
  })
}

// create document directories
function checkFolders(buildOptions) {
  fs.stat(buildOptions.buildDir, function(err, out) {
    if (out) {
      fs.stat(buildOptions.buildDir + 'assets', function(err, out) {
        if (err || buildOptions.updateApi) { copyAssets(buildOptions); }
      });
    } else {
      fs.mkdir(buildOptions.buildDir, function(err, out) {
        copyAssets(buildOptions);
      });
    }
  });
}

function checkOptions(buildOptions) {
  flags[3] = '--node-version=' + buildOptions.buildVersion;
  if (buildOptions.buildDir.slice(0,1) === '~') { buildOptions.buildDir = buildOptions.buildDir.replace(/^~/, os.homedir); }
  if (buildOptions.buildDir.slice(-1) !== docEnd) { buildOptions.buildDir += docEnd; }
  buildOptions.buildDir += buildOptions.buildName + docEnd;
  checkFolders(buildOptions);
}

function createDocs() {
  updateOptions(arguments)
}

module.exports = createDocs
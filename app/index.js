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
  buildVersion: process.version.slice(1)
}

var options = process.argv.slice(2);
console.log(options);

// check for command line scripting options
if(options[0] !== []) {
  options.forEach(function(ops, index) {
    console.log(ops);
    if (ops.startsWith('-v')) {
      var version = options[index + 1];
      buildOptions.buildVersion = version;
      flags[3] = '--node-version=' + version;
    } else if (ops.startsWith('-f')) {
      buildDir = options[index + 1];
      if (buildDir.slice(-1) !== docEnd) {
        buildDir += docEnd;
      }
      buildOptions.buildDir = buildDir + 'node-documents';
      console.log('Custom build dir: ', buildOptions.buildDir);
    }
    if (index === options.length - 1) {
      checkOptions();
    }
  });
}

// Check for modular options
function convertFile(file) {
  // take file and generate html file
  count++;
  flags[2] = apiDir + file;
  var filename = file.slice(0,-3);
  console.log('Creating doc ' + filename);
  var pathname = buildOptions.buildDir + filename + '.html';
  var fileStream = fs.createWriteStream(pathname);
  var createFile = spawn('node', flags);
  createFile.stdout.pipe(fileStream);
  createFile.on('close', (code) => {
    if (code !== 0) {
      console.log('NODe API: process exited with code ' + code);
    }
  });
  createFile.on('error', (err) => console.log('Error writing: ', err));
}

// grab template file and assets
function checkFiles() {
  fs.readdir(apiDir, function(err, res) {
    var ext = path.extname('*.md');
    if (err) console.error(err.stack);
    res.forEach((file) => {
      if (path.extname(file) === ext) {
         convertFile(file);
      }
    });
  });
}

function copyAssets() {
  fsx.copy(apiAssets, buildOptions.buildDir + 'assets', function(err) {
    if (err) return console.error('copy', err);
    console.log('NODe: asset copy success');
  });
  checkFiles();
}

// create document directory and copy assets
function checkFolders() {
  fs.stat(buildOptions.buildDir, function(err, out) {
    if (out) {
      console.log('NODe API: build folder exists');
      fs.stat(buildOptions.buildDir + 'assets', function(err, out) {
        if (err) {
          copyAssets();
        }
      });
    } else {
      console.log('NODe API: creating build folder');
      fs.mkdirSync(buildOptions.buildDir);
      copyAssets();
    }
  });
}

function checkOptions() {
  console.log(buildOptions.buildVersion);
  var version = buildOptions.buildVersion;
  flags[3] = '--node-version=' + version;

  if(buildOptions.buildDir.slice(0,1)) {
    buildOptions.buildDir = buildOptions.buildDir.replace(/^~/, os.homedir);
  }

  if (buildOptions.buildDir.slice(-1) !== docEnd) {
      buildOptions.buildDir += docEnd;
  }
  buildOptions.buildDir += 'node-documents-' + buildOptions.buildVersion + docEnd;
  console.log('NODe API: Building to Directory: %s', buildOptions.buildDir);
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
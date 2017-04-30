var fs = require('fs');
var path = require('path');
var os = require('os');
var fsx = require('fs-extra');
var arch = os.platform();

var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var gen = '/app/doc/tools/generate.js';
var dir = __dirname + '/doc/api/';
var buildDir = __dirname.slice(0,-3) + 'node-documents/';
var count = 0, argCount = 0;

var child;
var flags = [__dirname + '/doc/tools/doc/generate.js', '--template=' + __dirname + '/doc/template.html', ''];

var options = process.argv.slice(2);

// Check for options
options.forEach(function(ops) {
  if (ops.startsWith('-v')) {
    var version = process.argv[argCount + 3];
    flags[3] = '--node-version=' + version;
  } else if (ops.startsWith('-f')) {
    buildDir = process.argv[argCount + 3];
    if (buildDir.slice(-1) !== '/') {
       buildDir += '/';
    }
    buildDir += 'node-documents/';
  }
  argCount++;
});

console.log('NODe API: Building to Directory: %s', buildDir);

function convertFile(file) {
  // take file and generate html file
  if (arch === 'darwin' || arch === 'linux') {
    count++;
    flags[2] = __dirname + '/doc/api/' + file;
    var filename = file.slice(0,-3);
    var pathname = buildDir + filename + '.html';
    var fileStream = fs.createWriteStream(pathname);
    var createFile = spawn('node', flags);

    createFile.stdout.pipe(fileStream);
    createFile.on('close', (code) => {
      if (code !== 0) {
        console.log('NODe API: process exited with code ' + code);
      } else {
        // console.log('NODe API: Creating doc: ' + filename);
      }
    });
  } else if (arch === 'win32') {
    var bat = 'doc.bat';
    var command = bat + flags.join(' ') + file;
    exec(command, (err, out, stderr) => {
      if (err) console.log(err);
      console.log('NODe API: Creating HTML file: ' + file);
    });
  }
}

// grab template file and assets
function checkFiles() {
  fs.readdir(dir, function(err, res) {
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
  fsx.copy(__dirname + '/doc/api_assets', buildDir + 'assets/', (err) => {
    if (err) return console.error('copy', err);
    console.log('NODe API: Copy success!');
  });
}

// create document directory and copy assets
fs.stat(buildDir, (err, out) => {
  if (out) {
    console.log('NODe API: build folder exists');
    fs.stat(buildDir + 'assets', (err, out) => {
      if (err) {
        copyAssets();
      }
    });
  } else {
    console.log('NODe API: creating build folder');
    fs.mkdirSync(buildDir);
    copyAssets();
  }
});

checkFiles();

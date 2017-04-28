const fs = require('fs');
const path = require('path');
const os = require('os');
const fsx = require('fs-extra');
const arch = os.platform();

const { spawn, exec, execFile } = require('child_process');
const gen = '/app/doc/tools/generate.js';
const dir = __dirname + '/doc/api/';
let buildDir = __dirname.slice(0,-3) + 'build/';
let count = 0, argCount = 0;

var child;
let flags = [__dirname + '/doc/tools/doc/generate.js', '--template=' + __dirname + '/doc/template.html', ''];

const options = process.argv.slice(2);

// Check for options
options.forEach(function(ops) {
  if (ops.startsWith('-f')) {
    buildDir = process.argv[argCount + 3];
    if(buildDir.slice(-1) !== '/') {
       buildDir += '/';
    }
  } else if (ops.startsWith('-v')) {
    let version = process.argv[argCount + 3];
    flags[3] = '--node-version=' + version;
  }
  argCount++;
});

console.log('NODe API: Building to Directory: %s', buildDir);

function convertFile(file) {
  // take file and generate html file
  if (arch === 'darwin' || arch === 'linux') {
    count++;
    flags[2] = __dirname + '/doc/api/' + file;
    let filename = file.slice(0,-3);
    let pathname = buildDir + filename + '.html';
    const fileStream = fs.createWriteStream(pathname);
    const createFile = spawn('node', flags);

    createFile.stdout.pipe(fileStream);
    createFile.on('close', (code) => {
      if (code !== 0) {
        console.log('NODe API: process exited with code ' + code);
      } else {
        // console.log('NODe API: Creating doc: ' + filename);
      }
    });
  } else if (arch === 'win32') {
    const bat = 'doc.bat';
    const command = bat + flags.join(' ') + file;
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

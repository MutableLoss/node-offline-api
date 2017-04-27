const fs = require('fs');
const path = require('path');
const os = require('os');
const fsx = require('fs-extra');

const arch = os.platform();

const { spawn, exec, execFile } = require('child_process');
const gen = '/app/doc/tools/generate.js';
const dir = __dirname + '/doc/api/';
const buildDir = __dirname.slice(0,-3) + 'build/';
let count = 0;

console.log('Dir: %s', __dirname);

var child;
let flags = [__dirname + '/doc/tools/doc/generate.js', '--template=' + __dirname + '/doc/template.html', '', '--maxBuffer=1024*500'];

if (process.argv[2]) {
  flags.push(' --node-version=' + process.argv[2]);
}

function convertFile(file) {
  // take file and generate html file
  if (arch === 'darwin' || arch === 'linux') {
    count++;
    flags[2] = __dirname + '/doc/api/' + file;
    let filename = file.slice(0,-3);
    let pathname = buildDir + filename + '.html';
    const fileStream = fs.createWriteStream(pathname);
    const createFile = spawn('node', flags);
    createFile.stderr.on('data', (err) => {
      console.log(err.stack);
    });
    createFile.stdout.on('data', (data) => {
      console.log('Reading file %s', flags[2]);
      console.log('Creating HTML file: ' + file);
      // fs.writeFileSync(pathname, data);
      console.log(pathname);
    });
    createFile.stdout.pipe(fileStream);

    createFile.on('close', (code) => {
      if (code !== 0) {
        console.log(`process exited with code ${code}`);
      }
    });
    createFile.on('finish', () => {
      console.log('Stream closed!');
    })
  } else if (arch === 'win32') {
    const bat = 'doc.bat';
    const command = bat + flags.join(' ') + file;
    exec(command, (err, out, stderr) => {
      if (err) console.log(err);
      console.log('Creating HTML file: ' + file);
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
    if (err) return console.error(err);
    console.log('Copy success!');
  });
}

// create document directory and copy assets
fs.stat(buildDir, (err, out) => {
  if (err) console.log(err);
  // console.log(out.isDirectory());
  if (out) {
    console.log('build folder exists');
    fs.stat(buildDir + 'assets', (err, out) => {
      if (err) {
        copyAssets();
      }
    });
  } else {
    console.log('creating build folder');
    fs.mkdirSync(buildDir);
    copyAssets();
  }
});

checkFiles();

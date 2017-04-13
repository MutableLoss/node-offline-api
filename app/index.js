const fs = require('fs');
const path = require('path');
const os = require('os');
const fsx = require('fs-extra');

const arch = os.platform();

const { exec, execFile } = require('child_process');
const gen = '/app/doc/tools/generate.js';
const dir = __dirname + '/doc/api/';
let count = 0;

console.log('Dir: %s', __dirname);

var child;
let flags = [__dirname + '/doc/tools/doc/generate.js', '--template=' + __dirname + '/doc/template.html'];

if (process.argv[2]) {
  flags.push(' --node-version=' + process.argv[2]);
}

function convertFile(file) {
  // take file and generate html file
  if (arch === 'darwin' || arch === 'linux') {
    count++;
    let tempFlags = flags.slice(0);
    tempFlags.push(__dirname + '/doc/api/' + file);
    execFile('node', tempFlags, (err, out, stderr) => {
      if (err) console.log(err.stack);
      console.log('Reading file %s', tempFlags[2]);
      console.log('Creating HTML file: ' + file);
      let filename = file.slice(0,-3);
      let pathname = '../build/' + filename + '.html';
      fs.writeFileSync(pathname, out);
      console.log(pathname);
    });
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

// create document directory and copy assets
fs.stat('../build', (err, out) => {
  if (err) console.log(err);
  // console.log(out.isDirectory());
  if (out) {
    console.log('build folder exists');
  } else {
    console.log('creating build folder');
    fs.mkdirSync('../build');
    fsx.copy('doc/api_assets', '../build/assets/', (err) => {
      if (err) return console.error(err);
      console.log('success!');
    });
  }
});

checkFiles();

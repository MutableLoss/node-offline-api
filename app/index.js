const fs = require('fs');
const path = require('path');
const os = require('os');

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
      console.log(out);
    });
  } else if (arch === 'win32') {
    const bat = 'doc.bat';
    const command = bat + flags.join(' ') + file;
    exec(command, (err, out, stderr) => {
      if (err) console.log(err);
      if (stderr) console.log(stderr);
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

fs.stat('../build', (err, out) => {
  if (err) console.log(err);
  if (out) {
    console.log('build folder exists');
  } else {
    console.log('creating build folder');
    fs.mkdirSync('../build');
  }
});
  
// fs.mkdir()
// checkFiles();

// run
//  check version arg
//   build docs based on version
//   place files in specific location held by NODE_API_DOCS






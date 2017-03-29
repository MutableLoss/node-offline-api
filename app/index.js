const fs = require('fs');
const path = require('path');
const os = require('os');

const arch = os.platform();

const { exec, execFile } = require('child_process');
const gen = '/app/doc/tools/generate.js';
const dir = 'app/doc/api/';

console.log('Dir: %s', __dirname);

var child;
let flags = ['app/doc/tools/doc/generate.js', '--template=app/doc/template.html'];
  
if(process.argv[2]) {
  flags.push(' --node-version=' + process.argv[2]); 
}

function convertFile(file) {
  // take file and generate html file
  if(arch === 'darwin' || arch === 'linux') {
    let tempFlags = flags.slice(0);
    tempFlags.push('app/doc/api/' + file);
    execFile('node', tempFlags, (err, out, stderr) => {
      if(err) throw err.stack;
      console.log('Reading file %s', tempFlags[2]);
      console.log(out);
    });
  } else if(arch === 'win32') {
    let bat = 'doc.bat';
    let command = bat + flags.join(' ') + file;
    exec(command, (err, out, stderr) => {
      if(err) throw err;
      console.log(out);
    });
  }
}

// grab template file and assets
function checkFiles() {
  fs.readdir(dir, function(err, res) {
    var ext = path.extname('*.md');
    if(err) console.error(err.stack);
    res.forEach((file) => {
      if(path.extname(file) === ext) {
        convertFile(file);
      }
    });
  });
}

checkFiles();

// run
//  check version arg
//   build docs based on version
//   place files in specific location held by NODE_API_DOCS






var createDocs = require('../app/index.js').createDocs;
var buildOptions = require('../app/index.js').buildOptions;

// Test on OSX and Linux
// buildOptions.buildDir = '~/'

// Test on Windows
// '~' converts to home directory in Windows too
// buildOptions.buildDir = '~\\My Documents'

// Test version change
buildOptions.buildVersion = '4.4.0'
buildOptions.buildName = 'apidoc'

createDocs();
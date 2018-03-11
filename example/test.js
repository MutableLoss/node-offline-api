var createDocs = require('../app/index.js');

// Test on OSX and Linux
// createDocs('~/')

// Test on Windows
// '~' converts to home directory in Windows too
// createDocs('~\\My Documents')

createDocs('./', 'api-docs', '9.2.1');
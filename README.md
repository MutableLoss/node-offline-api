# Node.js offline document API

The Node.js Offline Document API (NODe API) module allows anyone to create an offline version of the Node.js documentation.

## Requirements

This module has been created to work with Node.js versions greater than 4.0.0, but many older versions will work, but it has not been tested or created to support these older versions.

## Usage

There are two different ways to use the NODe API, through the CLI, and as an added module to your Node.js applications.

### As a module in your JavaScript code

To use the NODe API in your own code, all that is needed is to require the module's createDoc method, and call it. 

```
var createDocs = require('node-offline-api').createDocs;

createDocs();
```

Calling this method will build the documents to the _node-documents-<version number>_.

If you need to change the desired build directory, or build version, you can change the buildOptions object to do exactly this.

```
var buildOptions = require('node-offline-api').buildOptions;

buildOptions = {
  buildDir: '/Users/username/Documents',
  version: '4.4.0'
}

createDocs();
```

### As a Script

You can also use NODe as your own script simply to pull and create Node.js documentation. 

After cloning the repository: https://github.com/3DEsprit/node-offline-api.git

$ npm i _or_ 'yarn install'

$ npm start

You will find the documentation built within the ./node-documents folder within the NODe API folder, and created for the version of node used to execute the script.


## Other Options

There are few options you can use with this script, but you will need to run it through node manually.


### Creating Documentation for Different Versions

By default the NODe API will create documentation based on version of node executing the script, but users can explicitly set the version to create when executing the  module using the _-v_ flag:

$ node app/ -v _version number_


### Building the Documentation Into a Specific Folder

Without this option, the NODe API will build the documentation into the build directory within the NODe folder itself. To build the documents into a specific folder, you can instead use the _-f_ flag followed by the specified folder:

$ node app/ -f _folder_

## License

The Node Offline Doucmentation API is under the MIT license. All contents of the app/doc folder are property of the Node.js project.
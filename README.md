# Node.js offline document API

[![npm version](https://badge.fury.io/js/node-offline-api.svg?style=flat-square)](https://badge.fury.io/js/node-offline-api)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Build Status](https://travis-ci.org/3DEsprit/node-offline-api.svg?branch=master)](https://travis-ci.org/3DEsprit/node-offline-api)
[![codecov](https://codecov.io/gh/3DEsprit/node-offline-api/branch/master/graph/badge.svg?style=flat-square)](https://codecov.io/gh/3DEsprit/node-offline-api)
[![dependencies](https://img.shields.io/david/expressjs/express.svg?style=flat-square)](https://codecov.io/gh/3DEsprit/node-offline-api)


The Node.js Offline Document API (NODe API) module allows anyone to create an offline version of the Node.js documentation for any version of Node.js.

## Requirements

While you can create documentation for any version of Node.js, this module has been created versions greater than 4.0.0 in mind. Since it has been created with ES5 for compatibility, older versions will work, but it has not been tested or created to support these older versions.


### Installation

You can clone this repository, or install via NPM.

*Via Source*

```
$ git clone https://github.com/3DEsprit/node-offline-api.git

$ npm i 
```

*Via NPM*

```
$ npm i node-offline-api
```

_or_

```
$ yarn add node-offline-api
```


## Usage

There are two different ways to use the NODe API, through the CLI, and as an added module to your Node.js applications.



### As a module in your JavaScript code

To use the NODe API in your own code, all that is needed is to require the module's createDoc method, and call it. 

```
var createDocs = require('node-offline-api').createDocs;

createDocs();
```

Run the createDocs method will build the documents to the _buildDir_ in the folder _buildName_ based on the default _buildVersion_. By default the build directory is in the root of the _running environment directory_, with the build folder name of _node-documents_ with the version set to match the version of node running the method. 

If you need to change the desired build directory, build folder name, or build version you can change the buildOptions object to do exactly this.

```
var buildOptions = require('node-offline-api').buildOptions;

buildOptions.buildDir = '/Users/username/Documents';
buildOptions.buildName = 'MyAPIDocs';
buildOptions.version = '4.4.0';

createDocs();
```

The way that NODe is written protects already generated documents by ignoring future requests when documents already exist. If you plan to update your documents many times with the same build name directory you will want to use the updateApi option. 

```
buildOptions.updateApi = true;
```

Setting this option to _true_ tells NODe to create and overwrite the existing documents with each request. 


### As a Script (0.10.2 and earlier)

You can also use NODe as your own script simply to pull and create Node.js documentation, but with less options. Even though this feature has less options, the options that do not exist can be easily scripted.

```
$ npm start
```


You will find the documentation built within the ./node-documents folder within the NODe API folder, and created for the version of node used to execute the script.

*There are few options you can use with this script, but you will need to run it through node manually.*


By default the NODe API will create documentation based on version of node executing the script, but users can explicitly set the version to create when executing the  module using the _-v_ flag:

```
$ node app/ -v [version number]
```


Without this option, the NODe API will build the documentation into the build directory within the NODe folder itself. To build the documents into a specific folder, you can instead use the _-f_ flag followed by the specified folder:

```
$ node app/ -f [folder]
```


## License

The Node Offline Doucmentation API has been written with the [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](). 

The Node.js Document API is property of the [Node.js Project](https://github.com/nodejs/node). [Node.js License](https://github.com/nodejs/node/blob/master/LICENSE)
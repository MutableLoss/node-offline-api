# Node.js offline document API

The Node.js Offline Document API (NODe API) module allows anyone to create an offline version of
 the Node.js documentation.


## Usage

After cloning the repository
$ npm i _or_ 'yarn install'
$ npm start

You will find the documentation in the ./build folder within the NODe API folder.

### Creating Documentation for Different Versions

By default the NODe API will create documentation based on version of node executing
the script, but users can explicitly set the version to create when executing the 
module using the _-v_ flag:

$ npm start -v _version number_


### Building the Documentation Into a Specific Folder

Without this option, the NODe API will build the documentation into the build directory
within the NODe folder itself. To build it into a specific folder, you can instead use
the -f flag followed by the specified folder:

$ npm start -f _folder_

## License

All contents of the app/doc folder are property of the Node.js project.
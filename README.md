# Node.js offline document API

The Node.js Offline Document API (NODe API) module allows anyone to create an offline version of the Node.js documentation.


## Usage

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
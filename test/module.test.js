var expect = require('chai').expect;
var fs = require('fs');
var fsx = require('fs-extra');
var buildOptions = require('../app/index.js').buildOptions;

buildOptions.buildDir = process.cwd();
buildOptions.buildName = 'node-docs';

describe('node-offline-api', () => {
  it('should create files', () => {
    var createDocs = require('../app/index').createDocs;
    createDocs();
    const build = fs.stat(`${buildOptions.buildDir}`, (err, out) => {
      expect(build).to.satisfy;
      expect(out).to.satisfy;
    });
  })
  it('should change options', () => {
    buildOptions.version = '4.4.0';

    expect(buildOptions.version).to.equal('4.4.0');
  })
})
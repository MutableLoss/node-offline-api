var expect = require('chai').expect;
var fs = require('fs');
var fsx = require('fs-extra');
var buildOptions = require('../app/index.js').buildOptions;

// buildOptions.buildDir = '~/';

describe('node-offline-api', () => {
  it('should create files', async () => {
    var createDocs = require('../app/index').createDocs;
    const build = fs.statSync(buildOptions.buildDir);
    expect(build).to.satisfy;
    fsx.remove(buildOptions.buildDir);
  })
  it('should change options', () => {
    buildOptions.version = '4.4.0';

    expect(buildOptions.version).to.equal('4.4.0');
  })
})
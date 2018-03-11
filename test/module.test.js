var expect = require('chai').expect;
var fs = require('fs');
var fsx = require('fs-extra');
var createDocs = require('../app/index');

describe('node-offline-api', () => {
  it('should create files', async () => {
    const docs = await createDocs()

    const build = await fs.stat('node-documents', (err, out) => {
      expect(build).to.satisfy;
      expect(out).to.satisfy;
    });
  })

  it('should change options from function', async () => {
    let targetDir = process.cwd()
    let version = '9.2.1'
    let folderName = 'test2'
    const docs = await createDocs(targetDir, folderName, version, false)

    const build = await fs.stat(targetDir + folderName, (err, out) => {
      expect(err).not.toBe('ENONT')
      expect(build).to.satisfy;
      expect(out).to.satisfy;
    });
  })
})
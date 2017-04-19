/* creates gulpfile in project so the built in gulp commands can be used */

var local = process.cwd().replace(/(\\)/g,'/'),
    fs = require('fs');

fs.createWriteStream(local+"/gulpfile.js").once('open', function(fd) {
  stream.write("module.exports = require('konnekt')();\n");
  stream.end();
});
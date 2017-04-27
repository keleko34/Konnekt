/* creates gulpfile in project so the built in gulp commands can be used */

var local = process.cwd().replace(/(\\)/g,'/'),
    fs = require('fs');

var stream = fs.createWriteStream(local+"/../../gulpfile.js");
stream.once('open', function(fd) {
  stream.write("require('konnekt')();\n");
  stream.end();
});

fs.mkdirSync(local+'/../../config');
var config = fs.createWriteStream(local+"/../../config/config.js");
config.once('open', function(fd) {
  config.write("Konnekt.configs({\r\n\r\n});\n");
  config.end();
});
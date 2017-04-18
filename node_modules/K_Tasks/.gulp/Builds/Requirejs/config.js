var fs = require('fs');

module.exports = {
  firstCommand:'Component',
  commands:{
    Component:{
      cmd: {
        short: "-c",
        long: "--component"
      },
      prompt: {
        type: "list",
        message: "Which module would you like to build?",
        choices: function(){
          return fs.readdirSync(global.gulp.base).filter(function(file){
            return (fs.statSync(global.gulp.base+"/"+file).isDirectory() && global.gulp.config.ignore.indexOf(file) === -1);
          });
        }
      },
      action:'end'
    }
  }
}

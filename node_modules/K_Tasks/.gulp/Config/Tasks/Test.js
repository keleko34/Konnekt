var fs = require('fs')

module.exports = {
  commands:{
    /*Component: {
      cmd: {
        short: "-c",
        long: "--component"
      },
      prompt: {
        type: "list",
        message: "Which module would you like to test?",
        choices: function(){
          return fs.readdirSync(global.gulp.base).filter(function(file){
            return (fs.statSync(global.gulp.base+"/"+file).isDirectory() && global.gulp.config.ignore.indexOf(file) === -1);
          });
        }
      },
      action:'Test'
    },*/
    Test: {
      cmd: {
        short: '-t',
        long: '--tests'
      },
      prompt: {
        type:"list",
        message: "Please choose a test to run",
        choices: function(){
          return fs.readdirSync(global.gulp.global+"/Tests");
        }
      },
      action:function(v)
      {
        return 'end';
      }
    }
  },
  port:1824,
  root:'test'
}

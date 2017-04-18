var fs = require('fs');

module.exports = {
  commands: {
    Port: {
      cmd: {
        short: "-p",
        long: "--port"
      },
      prompt: {
        type: "input",
        message: "Please enter a port for the server to use"
      },
      action:'Root'
    },
    Root: {
      cmd: {
        short: "-r",
        long: "--root"
      },
      prompt: {
        type: "input",
        message: "Please specify a root filepath"
      },
      action:'end'
    }
  },
  routes:(function(){
      var localRoutes = [];
      try{
        localRoutes = fs.readdirSync(global.gulp.local+"/Routes")
        .map(function(route){
          return require(global.gulp.local+"/Routes/"+route);
        });
      }
      catch(e){}
      return localRoutes;
    }()).concat(fs.readdirSync(global.gulp.global+"/Routes")
    .map(function(route){
      return require(global.gulp.global+"/Routes/"+route);
    }))
}

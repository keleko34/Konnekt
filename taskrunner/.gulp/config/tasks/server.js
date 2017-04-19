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
  routes:fs.readdirSync(global.gulp.global+"/routes")
  .map(function(route){
    return require(global.gulp.global+"/routes/"+route);
  })
}
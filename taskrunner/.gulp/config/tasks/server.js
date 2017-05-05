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
    }
  },
  routes:fs.readdirSync(global.gulp.global+"/routes")
  .map(function(route){
    return require(global.gulp.global+"/routes/"+route);
  })
}
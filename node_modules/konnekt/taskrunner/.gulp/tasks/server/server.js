var base = require('./../../Base'),
    query = require('querystring'),
    fs = require('fs'),
    connect = require('gulp-connect'),
    open = require('open');

module.exports = function()
{
  function Command(res)
  {
    console.info("\033[36mPress ctrl + o to quickly open the default web page in your default browser\033[37m");
    connect.server({
        root: '.',
        livereload: false,
        port:(res.Port && res.Port.length !== 0 ? parseInt(res.Port) : 8080),
        middleware:function(connect, opt){
            return global.gulp.config.Tasks.server.routes;
        }
    });

    var stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data',function(key)
    {
        if(key === '\u000f')
        {
            open('http://localhost:'+res.Port);
        }
        else
        {
            if (key === '\u0003')
            {
                process.exit();
            }
            process.stdout.write(key);
        }
    });

  }
  
  return base
  .task('server')
  .command(Command)
  .call();
}
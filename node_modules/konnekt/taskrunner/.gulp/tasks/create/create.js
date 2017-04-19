var base = require('./../../Base'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    fs = require('fs');

module.exports = function()
{
  function Command(res)
  {
    console.log('\033[36mStarting to Create module:\033[37m',res.Name);
    
    var _gulp = gulp.src(global.gulp.global+"/tasks/create/template/**/*"),
        _config = global.gulp.config.Tasks.create,
        _resKeys = Object.keys(res);

    function rekey(key)
    {
      return _gulp.pipe(replace(new RegExp('(\\$'+key+')','g'),res[key]))
      .pipe(rename(function(path){
        path.dirname = path.dirname.replace(new RegExp('(\\$'+key+')','g'),res[key]);
        path.basename = path.basename.replace(new RegExp('(\\$'+key+')','g'),res[key]);
      }));
    }

    for(var x=0,len=_resKeys.length;x<len;x++)
    {
      _gulp = rekey(_resKeys[x]);
    }

    _gulp.pipe(gulp.dest(_config.destination+"/"+res.Name))
    .on('end',function(e){
      if(typeof _config.onFinished === 'function') _config.onFinished(res);
    });
  }
  
  return base
  .task('create')
  .command(Command)
  .call();
}
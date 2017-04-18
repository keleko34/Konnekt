var fs = require('fs'),
    querystring = require('querystring'),
    gulp = require('gulp'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    gap = require('gulp-append-prepend'),
    clean = require('gulp-clean'),
    modify = require('gulp-modify'),
    closureCompiler = require('gulp-closure-compiler');

module.exports = function(res)
{
  console.log('\033[36mCompiling:\033[37m',res.Name,' \033[36mFor channel:\033[37m',res.Channel);
  var _base = global.gulp.config.Tasks.Build.base,
      _dest = '.'+_base+'/'+res.Name+(res.Channel !== 'cms' ? '/build/'+res.Channel : '/cms'),
      _dir = global.gulp.base+_base+'/'+res.Name+(res.Channel === 'cms' ? '/cms' : (res.BuildFrom !== 'dev' ? '/build/'+res.BuildFrom : '')),
      _devfiles = ['js'];

  if(res.BuildFrom === 'dev')
  {
    var html = fs.readFileSync(_dir+"/"+res.Name+".html",'utf8'),
        css = fs.readFileSync(_dir+"/"+res.Name+".css",'utf8');
    gulp.src(_devfiles.map(function(file){
      return _dir+"/"+res.Name+'.'+file;
    }))
    .pipe(gap.appendText('\r\n'+res.Name+'.prototype.k_html = "'+html.replace(/[\r\n]/g,'').replace(/[\"]/g,"'")+'";'
                        +'\r\n'+res.Name+'.prototype.k_css = "'+css.replace(/[\r\n]/g,'').replace(/[\"]/g,"'")+'";'))
    .pipe(gap.prependText('if(!K_Components) K_Components = {};\r\nK_Components["'+res.Name+'"] = (function(){\r\n\t'))
    .pipe(gap.appendText('\r\n\treturn '+res.Name+';\r\n}());'))
    .pipe(gulp.dest(_dest))
    .pipe(closureCompiler({
      compilerPath:"./compiler.jar",
      fileName:res.Name+".min.js",
      compilerFlags:{
        compilation_level: 'SIMPLE',
        charset:'UTF-8'
      }
    }))
    .pipe(gulp.dest(_dest))
    .on('end',function(){

      console.log('\033[36mFinished Compiling \033[37m',res.Name);
    })

  }
  else if(res.BuildFrom === 'cms')
  {
    var html = fs.readFileSync(_dir+"/"+res.Name+".html",'utf8'),
        css = fs.readFileSync(_dir+"/"+res.Name+".css",'utf8');
    gulp.src(_devfiles.map(function(file){
      return _dir+"/"+res.Name+'.'+file;
    }))
    .pipe(gap.appendText('\r\n'+res.Name+'.prototype.kcms_html = "'+html.replace(/[\r\n]/g,'').replace(/[\"]/g,"'")+'";'
                        +'\r\n'+res.Name+'.prototype.kcms_css = "'+css.replace(/[\r\n]/g,'').replace(/[\"]/g,"'")+'";'))
    .pipe(gap.prependText('if(!KCMS_Components) KCMS_Components = {};\r\nKCMS_Components["'+res.Name+'"] = (function(){\r\n\t'))
    .pipe(gap.appendText('\r\n\treturn '+res.Name+';\r\n}());'))
    .pipe(rename({
      basename: "temp",
    }))
    .pipe(gulp.dest(_dest))
    .pipe(closureCompiler({
      compilerPath:"./compiler.jar",
      fileName:res.Name+".min.js"
    }))
    .pipe(gulp.dest(_dest))
    .on('end',function(){
      gulp.src(_devfiles.map(function(file){
        return _dir+'/temp.'+file;
      }),{read:false})
      .pipe(clean({force: true}));
      console.log('\033[36mFinished Compiling \033[37m',res.Name);
    })

  }
  else{
    _devfiles = (res.Channel !== 'prod' ? ['js','min.js'] : ['min.js']);
    gulp.src(_devfiles.map(function(file){
      return _dir+"/"+res.Name+'.'+file;
    }))
    .pipe(gulp.dest(_dest))
    .on('end',function(){
      console.log('\033[36mFinished Compiling \033[37m',res.Name);
    });
  }
}

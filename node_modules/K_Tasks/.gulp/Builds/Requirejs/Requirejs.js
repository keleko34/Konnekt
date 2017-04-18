var gulp = require('gulp')
  , modify = require('gulp-modify')
  , inject = require('gulp-inject')
  , replace = require('gulp-replace')
  , beautify = require('js-beautify').js_beautify
  , closureCompiler = require('gulp-closure-compiler')
  , fs = require('fs');

module.exports = function(res)
{
    /* Holds libs in order, libs are added to base, in the case more than one uses it, like node_modules */
    var masterSubs = [];

    function tryBower(name)
    {
        try
        {
            var fstat = fs.statSync(global.gulp.base+'/bower_components/'+name);
            if(fstat.isDirectory())
            {
                var main = JSON.parse(fs.readFileSync(global.gulp.base+"/bower_components/"+name+"/bower.json")).main;
                return "/bower_components/"+url+"/"+main;
            }
            else
            {
                return tryNode(name);
            }
        }
        catch(e)
        {
            return tryNode(name);
        }
    }

    function tryNode(name)
    {
        try
        {
            var fstat = fs.statSync(global.gulp.base+'/node_modules/'+name);
            if(fstat.isDirectory())
            {
                return "/node_modules/"+name+"/"+name+"/"+name+".js";
            }
        }
        catch(e)
        {
            return null;
        }
    }
  
    function tryLocals(name)
    {
      try
      {
        var dir = fs.readdirSync(global.gulp.base).filter(function(file){
            return (['node_modules','bower_components','LICENSE'].indexOf(file) === -1 && file.indexOf('.') === -1);
          });
        for(var x=0,len=dir.length;x<len;x++)
        {
          var stat = fs.statSync(global.gulp.base+"/"+dir[x]);
          if(stat.isDirectory())
          {
            var subdir = fs.readdirSync(global.gulp.base+"/"+dir[x]).filter(function(file){
				return (['node_modules','bower_components','LICENSE'].indexOf(file) === -1 && file.indexOf('.') === -1);
			});
            if(subdir.indexOf(name) !== -1)
            {
              var statLocal = fs.statSync(global.gulp.base+"/"+dir[x]+"/"+name+"/"+name+".js");
              
              if(statLocal.isFile())
			  {
				  return "/"+dir[x]+"/"+name+"/"+name+".js";
			  }
            }
          }
        }
        return tryBower(name);
      }
      catch(e)
      {
        return tryBower(name);
      }
    }

    function modifyFileContents(file,contents)
    {
        var reD = /(define)(.*)(function\()(.*)(\))(.*)(?:{)/,
            reD2 = /(define)(.*)(function\()(.*)(\))/,
            reE = /\}\)(?![\s\S]*}\))/m,
            reM = /(define\()(\[(.*?)\])/,
            reN = /(define\()(.*?)(function\((.*?)\))/;


        var subModules = contents.match(reM)[0].replace(reM,"$3").replace(/\"/g,'').replace(/\'/g,'').split(',').filter(function(v){
            return (v.length !== 0);
        }),
        moduleNames = subModules.map(function(v){
            if(v.indexOf(".") === -1 && v.indexOf("/") === -1) v = "/"+v;

            return ("Create"+v.substring((v.lastIndexOf("/")+1),v.length));
        }),
        subNames = contents.match(reN)[0].replace(reN,'$4');

        if(typeof this.extended === 'function') this.extended(subModules,moduleNames,subNames);

        contents = contents.replace(reE,"}("+moduleNames.join(",")+"))")
        .replace(reD,("var Create"+this.name+" = (function("+subNames+"){"))
        .replace(reD2,("var Create"+this.name+" = (function("+subNames+")"));

        return contents;
    }

    function build(oem,path,cb)
    {
        var name = path.substring((path.lastIndexOf("/")+1),path.lastIndexOf(".")),
            counter = 0,
            subFiles = [],
            subNames = [],
            moduleNames = [],
            _gulpsrc = gulp.src(path),
            onSubBuild = function(glp)
            {
                counter += 1;
                if(counter === subFiles.length)
                {
                    cb(_gulpsrc);
                }
                else
                {
                    build(undefined,subFiles[counter],onSubBuild);
                }
            };

        if(!oem && masterSubs.indexOf(path) === -1) masterSubs.push(path);

        _gulpsrc.filepath = path;

        console.log('\033[36mCompiling File:\033[37m',name);

        var mod = (modifyFileContents).bind({extended:function(subModules,moduleNames,subNames){
                subFiles = subModules.map(function(file)
                {
                    if(file.indexOf('.') === -1 && file.indexOf('/') === -1)
                    {
                        //we have a bower or node_module
                        var module_path = tryLocals(file);
                        if(module_path){
                            return global.gulp.base+module_path;
                        }
                    }
                    if(file.indexOf('.') === 0)
                    {
                        //we have a localized file
                        var local = path.substring(0,path.lastIndexOf('/')),
                            filePath = local+file.substring(1,file.length)+(file.indexOf('.',1) === -1 ? '.js' : '');

                        try{
                            var fstat = fs.statSync(filePath);
                            if(fstat.isFile())
                            {
                                return filePath;
                            }
                        }
                        catch(e){
                            console.error("No file exists as: ",filePath);
                        }
                    }
                    return "";
                })
                .filter(function(file){
                    return (file.length !== 0 && masterSubs.indexOf(file) === -1);
                });

                masterSubs.splice((oem ? 0 : (masterSubs.length-1)),0,subFiles)
                masterSubs = Array.prototype.concat.apply([],masterSubs);

        },name:name});


        _gulpsrc.pipe(modify({
            fileModifier: mod
        }));

        if(oem) _gulpsrc.pipe(gulp.dest(oem))

        _gulpsrc.on('end',function(){
            if(counter === subFiles.length)
            {
                cb(_gulpsrc);
            }
            else
            {
                build(undefined,subFiles[counter],onSubBuild);
            }
        })
        .on('error',function(){
            console.log("error");
        })
    }

    function injector(main,cb)
    {
        var counter = 0,
            injectModule = function()
            {
                var name = masterSubs[counter].substring((masterSubs[counter].lastIndexOf("/")+1),masterSubs[counter].lastIndexOf(".")),
                    mod = (modifyFileContents).bind({name:name});

                gulp.src(main).pipe(inject(gulp.src(masterSubs[counter]).pipe(modify({
                    fileModifier: mod
                })),{
                    removeTags:true,
                    starttag: '/* Build */',
                    endtag: '/* End Build */',
                    transform: function(filepath,file,i,length){
                        var contents = file.contents.toString('utf8');
                        if(contents.indexOf('/* Build */') === -1 && (counter+1) !== masterSubs.length) contents += '\r\n/* Build */\r\n/* END BUILD */';
                        console.log('\033[36mInjecting File:\033[37m',name);
                        return contents;
                    }
                }))
                .pipe(gulp.dest(main.substring(0,main.lastIndexOf('/'))))
                .on('end',onSubInject);
            }
            onSubInject = function()
            {
                counter += 1;
                if(counter !== masterSubs.length)
                {
                    injectModule();
                }
                else
                {
                    cb(main);
                }
            };

        if(masterSubs.length !== 0)
        {
          injectModule();
        }
        else
        {
          cb();
        }
    }

    function Command(res,local,package)
    {
        console.log('\033[36mStarting to compile module:\033[37m',res.Component);

        var buildFile = (local ? '/'+res.Component+'/'+res.Component+'.js' : ('/'+res.Component+'/'+res.Component+'/'+res.Component+'.js')),
            buildLocation = (local ? '/'+res.Component+'/Build' : ('/'+res.Component+'/'+res.Component+'/Build'))

        return build(global.gulp.base+buildLocation,global.gulp.base+buildFile,function(glp){
            injector(global.gulp.base+buildLocation+'/'+res.Component+'.js',function(){
                setTimeout(function(){
                  console.log('\033[36mRunning clojure compiler minification\033[37m');

                  gulp.src(global.gulp.base+buildLocation+'/'+res.Component+'.js')
                  .pipe(modify({
                      fileModifier: function(file,contents){
                          contents = "var "+res.Component+" = (function(){\r\n"+contents+"\r\n if((typeof window !== 'undefined') && (typeof window.define !== 'undefined') && (typeof window.require !== 'undefined')){define([],function(){ return Create"+res.Component+";});}else if((typeof module !== 'undefined')){module.exports = Create"+res.Component+";} \r\nreturn Create"+res.Component+";\r\n}())";
                          return beautify(contents);
                      }
                  }))
                  .pipe(replace(/^\s*[\r\n]/gm,""))
                  .pipe(gulp.dest('./'+(local ? res.Component : (res.Component + '/' + res.Component))+'/Build'))
                  .on('end',function(){
                    gulp.src('./'+(local ? res.Component : (res.Component + '/' + res.Component))+'/Build/'+res.Component+'.js')
                    .pipe(closureCompiler({
                      compilerPath:"./compiler.jar",
                      fileName:res.Component+".min.js"
                    }))
                    .pipe(gulp.dest('./'+(local ? res.Component : (res.Component + '/' + res.Component))+'/Min'));
                  });
                },0);
            });
        });
    }

     if(res.Component !== undefined){
        fs.stat('./'+res.Component+'/'+res.Component+'.js',function(e){
          if(!e)
          {
              console.log("Building local");
              Command(res,true,false);
          }
          else
          {
              fs.stat('./'+res.Component+'/package.json',function(e){
                  if(!e)
                  {
                      fs.stat('./'+res.Component+'/'+res.Component+'/'+res.Component+'.js',function(e){
                          if(!e)
                          {
                              console.log("Building package");
                              Command(res,false,true);
                          }
                          else
                          {
                              console.error('\033[31mYour missing a main js file by the same name:\033[37m ',res.Component);
                              process.exit(1);
                          }
                      })
                  }
                  else
                  {
                      console.error('\033[31mYour missing a main js file by the same name:\033[37m ',res.Component);
                      process.exit(1);
                  }
              });
          }
      });
    }
}

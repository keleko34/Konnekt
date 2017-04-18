var fs = require('fs')

module.exports = {
  commands:{
    Build: {
      cmd: {
        short: '-b',
        long: '--build'
      },
      prompt: {
        type:"list",
        message: "Please choose a build library to use",
        choices: function(){
          return fs.readdirSync(global.gulp.global+"/Builds")
          .concat((function(){
            var localBuilds = [];
            try{
              localBuilds = fs.readdirSync(global.gulp.local+"/Builds")
              .map(function(v){
                return 'local/'+v;
              });
            }
            catch(e){}
            return localBuilds;
          }()));
        }
      },
      action:function(v,values){
        var isLocal = (v.indexOf('local/') !== -1),
            src = (isLocal ? global.gulp.local : global.gulp.global).replace(/\\/g,'/')+"/Builds";
        v = (isLocal ? v.replace('local/','') : v);
        var config = require(src+"/"+v+"/config");

        function rec(lvl,props)
        {
          Object.keys(props)
          .forEach(function(prop){
            if(typeof lvl[prop] === 'object')
            {
              rec(lvl[prop],props[prop]);
            }
            else
            {
              lvl[prop] = props[prop];
            }
          });
        }

        rec(global.gulp.config.Tasks.Build,config);
        values.builder = require(src+"/"+v+"/"+v);
        return global.gulp.config.Tasks.Build.firstCommand;
      }
    }
  }
}

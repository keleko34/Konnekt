var fs = require('fs');

module.exports = {
  commands:{
      Template:{
          cmd:{
              short:'-t',
              long:'--template'
          },
          prompt:{
              type:'list',
              message:'Which template would you like to create?',
              choices:fs.readdirSync(global.gulp.global+"/Templates")
              .concat((function(){
                var localTemplates = [];
                try{
                  localTemplates = fs.readdirSync(global.gulp.local+"/Templates")
                  .map(function(v){
                    return 'local/'+v;
                  });
                }
                catch(e){}
                return localTemplates;
              }()))
          },
          action:function(v,values){
            var isLocal = (v.indexOf('local/') !== -1),
                src = (isLocal ? global.gulp.local : global.gulp.global).replace(/\\/g,'/')+"/Templates";
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

            rec(global.gulp.config.Tasks.Create,config);
            values.templateFiles = src+"/"+v+"/Template/**/*";
            return global.gulp.config.Tasks.Create.firstCommand;
          }
      }
  }
}

var fs = require('fs');

module.exports = {
  commands:{
    Front_End:{
      cmd:{
        short:'-fr',
        long:'--frontend'
      },
      prompt:{
        type:'list',
        message:'Please choose a front end test',
        choices:fs.readdirSync(global.gulp.global+"/Tests/FrontEndWebLibrary/Tests")
        .concat((function(){
          try{
            return fs.readdirSync(global.gulp.base+"/.gulp/Tests/FrontEndWebLibrary/Tests");
          }
          catch(e){
            
          }
        }()))
      }
    }
  }
};
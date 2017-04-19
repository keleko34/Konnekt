var fs = require('fs');

module.exports = {
  Tasks: fs.readdirSync(global.gulp.global+"/tasks").reduce(function(Obj,file){
	  Obj[file.replace('.js','')] = require(global.gulp.global+'/config/tasks/'+file);
    return Obj;
  },{}),
  ignore:[
        "test",
        "bower_components",
        "node_modules",
        ".gulp",
        ".git"
    ]
}
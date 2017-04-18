var fs = require('fs');

module.exports = {
  Tasks: fs.readdirSync(__dirname+"/Tasks").reduce(function(Obj,file){
	  Obj[file.replace('.js','')] = require(__dirname+'/Tasks/'+file);
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

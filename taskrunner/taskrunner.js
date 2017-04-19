module.exports = function()
{
  var gulp = require('gulp'),
      fs = require('fs');
  
  /* Globals */
  global.gulp = {};
  global.gulp.module = gulp;
  global.gulp.base = process.cwd().replace(/\\/g,"/");
  global.gulp.node_module = __dirname.replace(/\\/g,"/");
  global.gulp.global = __dirname.replace(/\\/g,"/")+"/.gulp";
  global.gulp.config = require(global.gulp.global+'/config/config.js');
  
  /* Fetch all tasks */
  global.gulp.tasks = fs.readdirSync(global.gulp.global+"/tasks").reduce(function(Obj,folder){
    Obj[folder] = require(global.gulp.global+"/tasks/"+folder+"/"+folder);
    return Obj;
  },{});
  
  /* define the tasks to gulp */
  Object.keys(global.gulp.tasks).forEach(function(task){
    if(global.gulp.config.Tasks[task] !== undefined){
      gulp.task(task.toLowerCase(),global.gulp.tasks[task]);
    }
    else{
      console.log('\033[31You are missing a config file in .gulp/config/'+task+'/'+task+'.js for task:  \033[37m '+task);
    }
  });
}
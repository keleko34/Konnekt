module.exports = function(){
  var gulp = require('gulp'),
    fs = require('fs');

  global.gulp = {};
  global.gulp.module = gulp;
  global.gulp.base = process.cwd().replace(/\\/g,"/");
  global.gulp.local = global.gulp.base+"/.gulp";
  global.gulp.node_module = __dirname;
  global.gulp.global = __dirname+"/.gulp";
  global.gulp.config = require(__dirname+'/.gulp/Config/Config.js');
  /* local gulps */

  /* Gulp Task Modules

    This Auto loads all tasks inside the .gulp Tasks folder, simply put new tasks
    in there if you want them registered
  */

  /* Node Gulp */
  try{
    global.gulp.tasks = fs.readdirSync(__dirname+"/.gulp/Tasks").reduce(function(Obj,folder){
      Obj[folder] = require(__dirname+"/.gulp/Tasks/"+folder+"/"+folder);
      return Obj;
    },{});
  }catch(e){
    if(e.code === 'ENOENT'){
      console.error('\033[31You do not have a Tasks folder in k_tasks .gulp, Please submit bug report \033[37m');
    }
    else
    {
      console.error(e);
    }
    return;
  }

  /* local gulp */
  try{
    var hasLocalConfig = fs.statSync(global.gulp.local+"/Config"),
        hasLocalTasks = fs.statSync(global.gulp.local+"/Tasks");

    if(hasLocalConfig && hasLocalConfig.isDirectory()){
      var localConfigs = require(global.gulp.local+"/Config/Config.js");
      if(localConfigs.Tasks !== undefined)
      {
        Object.keys(localConfigs.Tasks).forEach(function(taskConfig){
          global.gulp.config.Tasks[taskConfig] = localConfigs.Tasks[taskConfig];
        });
      }
      Object.keys(localConfigs).forEach(function(config){
        if(config !== "Tasks")
        {
          global.gulp.config[config] = localConfigs[config];
        }
      });
    }

    if(hasLocalTasks && hasLocalTasks.isDirectory()){
      var localTasks = fs.readdirSync(global.gulp.base+"/.gulp/Tasks").forEach(function(folder){
        global.gulp.tasks[folder] = require(global.gulp.base+"/.gulp/Tasks/"+folder+"/"+folder);
      });
    }
  }catch(e){
    if(e.code !== 'ENOENT'){
      console.error(e);
    }
  }

  Object.keys(global.gulp.tasks).forEach(function(task){
    if(global.gulp.config.Tasks[task] !== undefined){
      gulp.task(task.toLowerCase(),global.gulp.tasks[task]);
    }
    else{
      console.log('\033[31You are missing a config file in .gulp/Config/'+task+'/'+task+'.js for task:  \033[37m '+task);
    }
  });
}

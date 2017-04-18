var base = require('./../../Base'),
    prompt = prompt = require('gulp-prompt'),
    gulp = require('gulp'),
    beautify = require('js-beautify').js_beautify,
    file = require('gulp-file'),
    fs = require('fs');

module.exports = function(){

console.log("task");
  var _Commands = {},
      _currentCommand = {},
      _values = {};

  function CreateFiles(){
    /* edits the main config and package.json file */


    /* Create the task and task config files */
    var template = fs.readFileSync('./.gulp/Tasks/Task/Templates/$Name.js','utf8'),
        valueKeys = Object.keys(_values),
        commandStr = JSON.stringify({commands:_Commands}),
        regJsonConvert = [/(":)/g,/({")/g,/(,")/g];

    for(var x=0;x<valueKeys.length;x++){
      var k = valueKeys[x],
          reg = new RegExp("(\\$(" + k + "))","g");
      template = template.replace(reg,_values[k]);
      commandStr = commandStr.replace(reg,_values[k]);
    }
    regJsonConvert.forEach(function(k,i){
      commandStr = commandStr.replace(k,k.toString().replace(/[/\("\)g]/g,''));
    });
    commandStr = "module.exports = "+commandStr;

    file(_values.Name+'.js',beautify(commandStr, { indent_size: 2 }))
    .pipe(gulp.dest('./.gulp/Config/Tasks'));

    file(_values.Name+'.js',template)
    .pipe(gulp.dest('./.gulp/Tasks/'+_values.Name));

    /* update the main config to include the new tasks config */
    var config = fs.readFileSync('./.gulp/Config/Config.js','utf8');

    config = config.replace('Tasks: {','Tasks: {\r\n'+_values.Name+': require(\'./Tasks/' + _values.Name + '\'),');

    file('Config.js',beautify(config, { indent_size: 2 }))
    .pipe(gulp.dest('./.gulp/Config'));

    /* update package.json to add a script command */

  }

  function addCommand(res){
    if(res.Command){
      base.gulp(base.gulp().pipe(prompt.prompt({
        name:'Name',
        type:'input',
        message:'What do you want this command to be called?'
      },commandName)));
    }
    else{
      CreateFiles();
    }
  }

  function commandName(res){
    if(_Commands[res.Name] === undefined){
      _currentCommand = {};
      _Commands[res.Name] = _currentCommand;
      base.gulp(base.gulp().pipe(prompt.prompt({
        name:'Short',
        type:'input',
        message:'please enter a short hand cli command for this field ex: -a or -c'
      },commandCmd)));
    }
    else{
      console.error('\033[31mA command with the name: ',res.Name,' already exists \033[35');
      Command();
    }
  }

  function commandCmd(res){
    if(_currentCommand.cmd === undefined){
      _currentCommand.cmd = {};
    }
    if(res.Short !== undefined){
      _currentCommand.cmd.short = res.Short;
      base.gulp(base.gulp().pipe(prompt.prompt({
        name:'Long',
        type:'input',
        message:'please enter a standard cli command for this field ex: --type or --name'
      },commandCmd)));
    }
    else if(res.Long){
       _currentCommand.cmd.long = res.Long;
      base.gulp(base.gulp().pipe(prompt.prompt({
        name:'Type',
        type:'list',
        message:'please select a type for this prompt',
        choices:['input','confirm','list']
      },commandPrompt)));
    }
  }

  function commandPrompt(res){
    if(_currentCommand.prompt === undefined){
      _currentCommand.prompt = {};
    }
    if(res.Type){
      _currentCommand.prompt.type = res.Type;
      base.gulp(base.gulp().pipe(prompt.prompt({
        name:'Message',
        type:'input',
        message:'please type a message for this prompt'
      },commandPrompt)));
    }
    else if(res.Message){
      _currentCommand.prompt.message = res.Message;
      if(_currentCommand.prompt.type === 'list'){
        base.gulp(base.gulp().pipe(prompt.prompt({
          name:'List',
          type:'input',
          message:'please add the choices for your list. Use \',\' for splitting the different choices'
        },commandPrompt)));
      }
      else{
        Command();
      }
    }
    else if(res.List){
      _currentCommand.prompt.choices = res.List.split(',');
      Command();
    }
  }

  function Exists(res,key){
    if(res.Type !== undefined && key === 'Name'){
      try
      {
        var exists = fs.statSync('./Tasks/' + res.Name + '/' + res.Name + '.js');
        if(exists){
          console.error('\033[31mThere is already a task by the name: \033[35',res.Name);
          process.exit(1);
        }
      }
      catch(e)
      {
        if(e.code !== 'ENOENT'){
          console.error(e);
          process.exit(1);
        }
      }
    }
  }

  function Command(res){
      if(res){
        _values = res;
      }
      base.gulp(base.gulp().pipe(prompt.prompt({
        name:'Command',
        type:'confirm',
        message:'Would you like to add a prompt command to this task?'
      },addCommand)));
  }

  return base
  .task('Task')
  .filter(Exists)
  .command(Command)
  .call();

}

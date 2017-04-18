var gulp = require('gulp'),
    replace = require('gulp-replace');

module.exports = {
  firstCommand:'Name',
  destination:'./.gulp/Templates',
  commands:{
    Name:{
      cmd:{
          short:'-n',
          long:'--name'
      },
      prompt:{
          type:'input',
          message:'What would you like to call this template?'
      },
      action:'Destination'
    },
    Destination:{
      cmd:{
          short:'-d',
          long:'--destination'
      },
      prompt:{
          type:'input',
          message:'Please enter destination folder for template created items (*note must start with "./" ./ === base directory of project)'
      },
      action:'CommandAdd'
    },
    CommandAdd:{
      prompt:{
          type:'list',
          message:'Would You like to add a prompt command to this?',
          choices:['yes','no']
      },
      action:function(v,values){
        if(v === 'no') values.FirstCommand = 'end';
        return (v === 'yes' ? 'Command' : 'end');
      }
    },
    Command:{
      store:'array',
      prompt:{
        type:'input',
        message:'What would You like to name this prompt command?'
      },
      action:function(v,values){
        if(values['CommandCMD_short'] === undefined) values['CommandCMD_short'] = [];
        if(values['CommandCMD_long'] === undefined) values['CommandCMD_long'] = [];
        values['CommandCMD_short'].push('-'+v.charAt(0).toLowerCase());
        values['CommandCMD_long'].push('--'+v.toLowerCase());
        values['Command'][(values['Command'].length-1)] = v.replace(/\s/g,'');
        if(values['CommandAction'] && values['CommandAction'][(values['CommandAction'].length-1)] === '$Awaiting'){
          values['CommandAction'][(values['CommandAction'].length-1)] = v.replace(/\s/g,'');
        }
        return 'CommandType';
      }
    },
    CommandType:{
      store:'array',
      prompt:{
        type:'list',
        message:'What type of prompt would you like this to be?',
        choices:['input','list']
      },
      action:function(v,values){
        return (v === 'input' ? 'CommandMessage' : 'CommandChoices');
      }
    },
    CommandMessage:{
      store:'array',
      prompt:{
        type:'input',
        message:'What should this prompt say?'
      },
      action:'CommandAction'
    },
    CommandChoices:{
      store:'array',
      prompt:{
        type:'input',
        message:'Please type the choices using "," as a delimiter'
      },
      action:'CommandMessage'
    },
    CommandAction:{
      store:'array',
      prompt:{
        type:'list',
        message:'What is the next thing you would like to run after this prompt?',
        choices:function(values){
          return ['--Create New Prompt','--End Prompts'].concat(values.Command);
        }
      },
      action:function(v,values){
        if(v === '--Create New Prompt')
        {
          values['CommandAction'][(values['CommandAction'].length-1)] = '$Awaiting';
          return 'Command';
        }
        if(v === '--End Prompts') values['CommandAction'][(values['CommandAction'].length-1)] = 'end';
        return 'FirstCommand';
      }
    },
    FirstCommand:{
      prompt:{
        type:'list',
        message:'What is the first prompt You would like to run?',
        choices:function(values){
          return values.Command;
        }
      },
      action:'end'
    }
  },
  onFinished:function(responses){

    function buildCommandObject(res)
    {
      var names = res.Command,
          short = res.CommandCMD_short,
          long = res.CommandCMD_long,
          type = res.CommandType,
          message = res.CommandMessage,
          choices = res.CommandChoices,
          actions = res.CommandAction;

      var obj = {};

      for(var x =0,len=names.length;x<len;x++)
      {
        obj[names[x]] = {};
        obj[names[x]].cmd = {};
        obj[names[x]].cmd.short = short[x];
        obj[names[x]].cmd.long = long[x];
        obj[names[x]].prompt = {};
        obj[names[x]].prompt.type = type[x];
        obj[names[x]].prompt.message = message[x];
        if(obj[names[x]].prompt.type === 'list')
        {
          obj[names[x]].prompt.choices = choices[0].split(',');
          choices.splice(0,1);
        }
        obj[names[x]].action = actions[x];
      }

      return obj;
    }
    console.log('\033[36mInserting Prompts\033[37m');
    var insert = JSON.stringify(buildCommandObject(responses),null,2);
    console.log(insert.substring((insert.indexOf('{')+1),insert.lastIndexOf('}')));
    gulp.src(global.gulp.local+"/Templates/"+responses.Name+"/config.js")
    .pipe(replace(/(\/\* Build Prompts \*\/)/g,insert.substring((insert.indexOf('{')+1),insert.lastIndexOf('}'))))
    .pipe(gulp.dest("./.gulp/Templates/"+responses.Name))
    .on('end',function(){
      console.log('\033[36mFinished inserting prompts for:\033[37m',responses.Template);
    })
  }
}

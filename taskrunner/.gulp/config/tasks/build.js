var fs = require('fs');

module.exports = {
  commands:{
    Names:{
      cmd:{
        short:'-n',
        long:'--name'
      },
      prompt:{
        type:'list',
        message:'What is the name of the component you would like to build?',
        choices:function(){
          try{
            var choices = fs.readdirSync(global.gulp.base+"/components");
          }
          catch(e)
          {
            console.error('No root components directory exist in: ',global.gulp.base+"/components");
            process.exit(0);
          }
          return choices;
        }
      },
      action:'Channel'
    },
    Channel:{
      cmd:{
        short:'-c',
        long:'--channel'
      },
      prompt:{
        type:'list',
        message:'What channel would You like to build?',
        choices:['qa','stage','prod','cms']
      },
      action:function(v,values){
        if(v !== 'cms' && v !== 'qa') return 'BuildFrom';
        if(v === 'cms'){
          values['BuildFrom'] = 'cms';
          return 'end';
        }
        values['BuildFrom'] = 'dev';
        return 'end';
      }
    },
    BuildFrom:{
      cmd:{
        short:'-bf',
        long:'--buildfrom'
      },
      prompt:{
        type:'list',
        message:'Would you like to build from latest dev or previous channel?',
        choices:function(values){
          var channels = ['qa','stage','prod'];
          return ['dev'].concat(channels[(channels.indexOf(values.Channel)-1)]);
        }
      },
      action:'end'
    }
  },
  base:'/components'
}
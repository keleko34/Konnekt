var gulp = require('gulp');

module.exports = {
  firstCommand:'Name',
  destination:"./components",
  commands:{
    Name:{
      cmd:{
          short:'-n',
          long:'--name'
      },
      prompt:{
          type:'input',
          message:'What would you like to call this component?'
      },
      action:'Description'
    },
    Description:{
      cmd:{
          short:'-d',
          long:'--description'
      },
      prompt:{
          type:'input',
          message:'What is the purpose of this component?'
      },
      action:'Author'
    },
    Author:{
      cmd:{
          short:'-a',
          long:'--author'
      },
      prompt:{
          type:'input',
          message:'Who is the author/developer for this component?'
      },
      action:'end'
    }
  },
  onFinished:function(res){
    console.log('\033[36mFinished Creating:\033[37m',res.Name);
  }
}

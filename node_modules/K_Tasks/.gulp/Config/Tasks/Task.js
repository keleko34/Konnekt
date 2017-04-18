module.exports = {
  commands:{
    Name:{
      cmd:{
        short:'-n',
        long:'--name'
      },
      prompt:{
        type:'input',
        message:'What would You like to name this Gulp Task?'
      },
      action:'Description'
    },
    Description:{
      cmd:{
        short:'-d',
        long:'--desc'
      },
      prompt:{
        type:'input',
        message:'Please write a brief description of what this task does'
      },
      action:'Author'
    },
    Author:{
      cmd:{
        short:'-a',
        long:'--auth'
      },
      prompt:{
        type:'input',
        message:'Initial Author of this Task?'
      },
      action:'end'
    }
  }
}

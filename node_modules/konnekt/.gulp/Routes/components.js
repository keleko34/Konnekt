//module.exports = require('konnektrt')();

 //for testing cms sessions
var krt = require('konnektrt')();

module.exports = function(req,res,next){
  req.sessions = {cms:true};
  krt(req,res,next);
};


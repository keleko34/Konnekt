var query = require('querystring')
  , fs = require('fs');

var settings = global.gulp,
    builds = fs.readdirSync(settings.base).filter(function(file){
        return (fs.statSync(settings.base+"/"+file).isDirectory() &&   ["test","bower_components","node_modules",".gulp",".git"].indexOf(file) === -1);
    });

module.exports = function(req,res,next)
{
  var url = req.url.substring(1,req.url.length);
  if(req.url.substring(0,(req.url.indexOf('?') !== -1 ? req.url.indexOf('?') : req.url.length)) === '/'){
      req.url = '/index.html';
  }
  else if(req.url.indexOf('/') === 0 && req.url.substring(1,req.url.length).indexOf('/') === -1)
  {
      function tryBower(url)
      {
          try
          {
              var fstat = fs.statSync(settings.base+'/bower_components/'+url);
              if(fstat.isDirectory())
              {
                  var main = JSON.parse(fs.readFileSync(settings.base+"/bower_components/"+url+"/bower.json")).main;
                  req.url = "/bower_components/"+url+"/"+main;
                  fs.createReadStream(settings.base+"/bower_components/"+url+"/"+main).pipe(res);
              }
              else
              {
                  tryNode(url);
              }
          }
          catch(e)
          {
              tryNode(url);
          }
      }

      function tryNode(url)
      {
          try
          {
              var fstat = fs.statSync(settings.base+'/node_modules/'+url);
              if(fstat.isDirectory())
              {
                  req.url = "/node_modules/"+url+"/"+url+"/"+url+".js";
                  fs.createReadStream(settings.base+"/node_modules/"+url+"/"+url+"/"+url+".js").pipe(res);
              }
          }
          catch(e)
          {

          }
      }

      function tryPackage(url)
      {
        try
        {
            var fstat = fs.statSync(settings.base+'/'+url+'/'+url+'/'+url+'.js');
            if(fstat.isFile())
            {
                req.url = "/"+url+"/"+url+"/"+url+".js";
                fs.createReadStream(settings.base+"/"+url+"/"+url+"/"+url+".js").pipe(res);
            }
            else
            {
                tryBower(url);
            }
        }
        catch(e)
        {
            tryBower(url);
        }
      }

      function tryLocal(url)
      {
        try
        {
            var fstat = fs.statSync(settings.base+'/'+url+'/'+url+'.js');
            if(fstat.isFile())
            {
                req.url = "/"+url+"/"+url+".js";
                fs.createReadStream(settings.base+"/"+url+"/"+url+".js").pipe(res);
            }
            else
            {
                tryPackage(url);
            }
        }
        catch(e)
        {
            tryPackage(url);
        }
      }

      tryLocal((req.url.indexOf('.') !== -1 ? req.url.substring(1,req.url.indexOf('.')) : req.url.substring(1,req.url.length)));
  }
  else
  {
      for(var x=0,len=builds.length;x<len;x++)
      {
          if(req.url.indexOf(builds[x]))
          {
              var q = query.parse(req.url.substring((req.url.indexOf('?')+1),req.url.length));
              if(q.env)
              {
                  if(q.env.toLowerCase() === 'build')
                  {
                      req.url = '/'+builds[x]+'/Build/'+builds[x]+'.js';
                  }
                  else if(q.env.toLowerCase() === 'min')
                  {
                      req.url = '/'+builds[x]+'/Min/'+builds[x]+'.min.js';
                  }
              }
          }
      }
  }
  return next();
}

/* stream appender */
var stream = require('stream'),
    util = require('util');

function CreateStream_Appender()
{

  function Stream_Appender(prepend,append)
  {
    var Transform = stream.Transform;

    function inject(options)
    {
      Transform.call(this, options);
    }
    util.inherits(inject, Transform);

    inject.prototype._transform = function(chunk,enc,cb)
    {
      this.push((typeof prepend === 'function' ? prepend(chunk.toString()) : chunk.toString()));
      cb();
    }

    inject.prototype._flush = function(cb)
    {
      if(typeof append === 'function') this.push(append());
      cb();
    }

    return new inject({});
  }

  Stream_Appender.append = function(str)
  {
    return Stream_Appender(null,function(){
      return str;
    });
  }

  Stream_Appender.prepend = function(str,alter)
  {
    var start = false;
    return Stream_Appender(function(chunk){
      if(!start)
      {
        chunk = str+(typeof alter === 'function' ? alter(chunk) : chunk);
        start = true;
      }
      return chunk;
    });
  }

  Stream_Appender.preappend = function(pre,ap,alter)
  {
    var start = false;
    return Stream_Appender(function(chunk){
      if(!start)
      {
        chunk = pre+(typeof alter === 'function' ? alter(chunk) : chunk);
        start = true;
      }
      return chunk;
    },function(){
      return ap;
    });
  }

  return Stream_Appender;
}

/* main file fetcher */
var fs = require('fs'),
    queryString = require('querystring'),
    path = require('path'),
    appPath = process.cwd().replace(/\\/g,"/"),
    componentPath = appPath+'/components',
    streamAppender = CreateStream_Appender(),
    append = streamAppender.append,
    prepend = streamAppender.prepend;

module.exports = function(req,res,next){
  req.sessions = {cms:true};
  if(req.url.indexOf('/component') === 0)
  {
    var _url = req.url,
        _query = queryString.parse(_url.substring((_url.indexOf('?')+1),_url.length)),
        _name = _url.replace('/component/','').replace(/[\/]/g,'').replace(/(\?)(.*?)+/g,''),
        _env = _query.env || 'prod',
        _debug = _query.debug,
        _edit = _query.edit,
        _allowed = (req.sessions ? req.sessions.cms : false),
        
        /* end file url */
        _end = translateEnv(_name,_env,_debug),

        /* Base component path */
        _base = appPath+'/components/'+_name,

        /* Full Path */
        _path = _base + _end,

        /* File Stream */
        _file,
        
        _finished = 0,
        _total = 0;
    
    fs.stat(_path,function(err,stat){
      if(!err)
      {
        _file = {file:fs.createReadStream(_path)};
        if(_env === 'dev')
        {
          _total = (_edit && _allowed ? 5 : 2);
          attachFile('k_css',_base+'/'+_name+'.css',_file,true);
          attachFile('k_html',_base+'/'+_name+'.html',_file,true);
          if(_edit && _allowed)
          {
            attachcms(_name,_base+'/cms',_file);
          }
        }
        else
        {
          if(_edit && _allowed)
          {
            _total = 3;
            attachcms(_name,_base+'/cms',_file);
          }
          else
          {
            sendfile(res,_file.file);
          }
        }
      }
      else
      {
        senderror(res,404,"No Component found by the name "+_name+" for environment "+_env);
      }
    });
    
    function translateEnv(name,env,debug)
    {
      return (env !== 'dev' ? ('/build/' + env + '/' + name + (debug ? '.js' : '.min.js')) : '/'+name+'.js');
    }
    
    function wrap(stream)
    {
      return stream
      .pipe(prepend('(function(){\r\n\t'))
      .pipe(append('\r\n\treturn '+_name+';\r\n}());'));
    }
    
    function addPrototype(key,value,stream)
    {
      return stream.pipe(append('\r\n'+_name+'.prototype.'+key+' = '+value+';\r\n'))
    }
    
    function attachFile(key,path,stream,isString)
    {
      fs.readFile(path,'utf8',function(err,contents){
        if(!err)
        {
          stream.file = addPrototype(key,(isString ? '"' : ('(function(){\r\n'))+(isString ? contents.replace(/[\r\n]/g,'').replace(/[\"]/g,"'") : contents)+(isString ? '"' : ('\r\n}())')),stream.file);
        }
        else
        {
          stream.file = addPrototype(key,(isString ? '""' : ('(function(){console.error("No part exists for '+key+'");}())')),stream.file);
        }
        _finished += 1;
        if(_finished === _total)
        {
          stream.file = wrap(stream.file);
          sendfile(res,stream.file);
        }
      });
    }

    function attachcms(name,path,stream)
    {
      attachFile('k_cms',path+'/'+name+'.js',stream);
      attachFile('k_cms_css',path+'/'+name+'.css',stream,true);
      attachFile('k_cms_html',path+'/'+name+'.html',stream,true);
    }

    function senderror(res,code,msg)
    {
      res.statusCode = code;
      res.statusMessage = msg;
      res.write(msg,'utf8',function(){
        res.end();
      });
    }

    function sendfile(res,stream)
    {
      if(_env === 'dev')
      {
        stream.pipe(prepend('K_Components["'+_name+'"] = ')).pipe(res);
      }
      else
      {
        stream.pipe(res);
      }
    }
  }
  else
  {
    next();
  }
};
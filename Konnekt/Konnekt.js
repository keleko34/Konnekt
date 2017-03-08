/* Build */
/* End Build */

K_Components = {};

define(['konnektdt','konnektmp','konnektl'],function(CreateData,CreateMapping,CreateLoader){

  function CreateKonnekt()
  {
    var _Loader = CreateLoader(),
      _mixed = CreateData(),
      _mapper = CreateMapping(),
      _model = _mixed({},"Model"),
      _viewmodels = {},
      _query = getQuery(),
      _ignoreList = ['id','filters','class','sessionStorage','localStorage','store','component'];

    /* This method will Create page, Create Viewmodel, attach binds, check children, load files, rinse, repeat */
    function Konnekt(node,params,pre,post)
    {
      var __name = node.tagName.toLowerCase(),
          __mappedAttrs;

      if(params === undefined) params = [];

      /* Pre -- all about built in data */
      if(pre === undefined) pre = {};
      if(!pre.filters) pre.filters = {};
      if(!pre.sessionStorage) pre.sessionStorage = false;
      if(!pre.localStorage) pre.localStorage = false;
      if(!pre.store) pre.store = false;
      if(!pre.multiple) pre.multiple = false;

      /* post all about post set data and pointers */
      if(post === undefined) post = {};

      if(!_mapper.isRegistered(__name))
      {
        _Loader.fetchBatch([
          '/Components/'+__name+'.js',
          '/Components/'+__name+'.html',
          '/Components/'+__name+'.css',
        ],function(contents){
          _mapper.register(__name,contents)
        });
      }
      else
      {
        /* check pointer refs here */
        __mappedAttrs = _mapper(__name);
      }




    }

    function getQuery()
    {
      return window.location.search.replace('?','')
      .split('&')
      .filter(function(v){return (v.length !== 0);})
      .reduce(function(o,v){
        o[v.split('=')[0]] = v.split('=')[1];
        return o;
      },{});
    }

    /* loads all component files structure: html, js, css, combined: name.prototype.html, name.prototype.css */
    Konnekt.load = function(name,fn)
    {
       _Loader(['Components/'+name+".js"],function(e){
          var vm = K_Components[Name],
              template = "<style>"+K_Components[name].prototype.style+"</style>"+K_Components[name].prototype.template;
       });
      return Konnekt;
    }

    /* Registers name to a component */
    Konnekt.register = function(name,vm,template)
    {

    }

    return Konnekt;
  }
  return CreateKonnekt;
});

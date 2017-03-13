/* Build */
/* End Build */
define(['KonnektDT','KonnektL','KonnektMP'],function(CreateData,CreateLoader,CreateMapping){

  function CreateKonnekt()
  {
    if(!window.K_Components) window.K_Components = {};

    var _Loader = CreateLoader().onLoad(onComponentLoad),
        _mixed = CreateData(),
        _mapper = CreateMapping(),
        _model = _mixed({},"Model"),
        _viewmodels = {},
        _cms = {},
        _query = getQuery(),
        _ignoreList = ['id','filters','class','sessionStorage','localStorage','store','component'],
        _waitList = {};

    /* This method will Create page, Create Viewmodel, attach binds, check children, load files, rinse, repeat */
    function Konnekt(node,params,pre,post)
    {
      var __name = node.tagName.toLowerCase(),
          __mappedAttrs;

      if(params === undefined) params = [];

      /* Pre -- all about built in data this will be allocated later to seperate file */
      if(pre === undefined) pre = {};

      /* base core filters usable in all components */
      if(!pre.filters) Object.defineProperty(pre,'filters',setDescriptor({}));

      /* whether to attempt to store data in sessionStorage */
      if(!pre.sessionStorage) Object.defineProperty(pre,'sessionStorage',setDescriptor(false,true));

      /* whether to attempt to store data in localStorage */
      if(!pre.localStorage) Object.defineProperty(pre,'localStorage',setDescriptor(false,true));

      /* whether to attempt to store data in the model */
      if(!pre.store) Object.defineProperty(pre,'store',setDescriptor(false,true));

      /* if this component can have children components of the same type, to prevent recursion */
      if(!pre.multiple) Object.defineProperty(pre,'multiple',setDescriptor(false,true));

      /* post all about post set data and pointers */
      if(post === undefined) post = {};

      post.innerhtml = node.innerHTML;
      for(var x=0,len=node.attributes.length;x<len;x++)
      {
        if(['id','class'].indexOf(node.attributes[x].name) === -1) post[node.attributes[x].name] = node.attributes[x].value;
      }

      function createViewmodel(name,component,params,pre,post)
      {
        var obsv = _mixed({},name);
        obsv.ignoreCreate('__proto__');

        for(var x=0,keys=Object.keys(component.prototype),len=keys.length;x<len;x++)
        {
          obsv.__proto__[keys[x]] = component.prototype[keys[x]];
        }

        /* Pre attachments, core methods */
        for(var x=0,keys=Object.keys(pre),len=keys.length;x<len;x++)
        {
            if(obsv.isObservable(pre,keys[x]))
            {
                obsv.addPointer(pre,keys[x]);
            }
            else
            {
                obsv.add(keys[x],pre[keys[x]]);
            }
        }

        component.apply(obsv,params);

        /* Post attachments, overwritables, for data or pointers */
        for(var x=0,keys=Object.keys(post),len=keys.length;x<len;x++)
        {
            if(obsv.isObservable(post,keys[x]))
            {
              if(obsv[keys[x]] !== undefined) obsv.remove(keys[x]);
              obsv.addPointer(post,keys[x]);
            }
            else
            {
              obsv.set(keys[x],post[keys[x]]);
            }
        }


        /* Apply session storage if set */
        if(obsv.sessionStorage)
        {
            var storage = sessionStorage.getItem((obsv.id || name));
            if(storage)
            {
                storage = JSON.parse(storage);
                for(var x=0,keys=Object.keys(storage),len=keys.length;x<len;x++)
                {
                    obsv.set(keys[x],storage[keys[x]]);
                }
            }
            else
            {
                sessionStorage.setItem((obsv.id || name),obsv.stringify());
            }
            obsv.addChildDataUpdateListener('*',function(){
                sessionStorage.setItem((obsv.id || name),obsv.stringify());
            });
        }

        /* Apply local storage if set */
        if(obsv.localStorage)
        {
            var storage = localStorage.getItem((obsv.id || name));
            if(storage)
            {
                storage = JSON.parse(storage);
                for(var x=0,keys=Object.keys(storage),len=keys.length;x<len;x++)
                {
                    obsv.set(keys[x],storage[keys[x]]);
                }
            }
            else
            {
                localStorage.setItem((obsv.id || name),obsv.stringify());
            }
            obsv.addChildDataUpdateListener('*',function(){
                localStorage.setItem((obsv.id || name),obsv.stringify());
            });
        }

        if(obsv.store)
        {
            _model.set((obsv.id || name),obsv);
        }

        return obsv;
      }

      function mapTargets(target,maps,vm)
      {
        target.kb_viewmodel = vm;
        console.log(maps);
        for(var x=0,len=maps.length;x<len;x++)
        {
          if(maps[x].type !== 'for' && maps[x].type !== 'component')
          {

          }
        }

      }

      function getValue(bindTexts,vm)
      {
        var val = "",
            _bind = {},
            _currKey = "";
        for(var x=0,len=bindTexts.length;x<len;x++)
        {
          _bind = bindTexts[x];
          if(typeof _bind === 'string')
          {
            val += _bind;
          }
          else
          {
            _currKey = _bind.key;
            _bind.value =  (_bind.filters.reduce(function(v,k){
              return (typeof vm.filters[k] === 'function' ? vm.filters[k](v) : v);
            },vm.getLayer(_currKey)[_currKey.split('.').pop()]));
            val += _bind.value;
          }
        }
        return val;
      }

      function mapVM(map,bindTexts,vm)
      {
        for(var x=0,len=bindTexts.length;x<len;x++)
        {
          if(typeof bindTexts[x] !== 'string')
          {

          }
        }
      }

      function handleMaps(vm,maps)
      {
          for(var x=0,len=maps.length;x<len;x++)
          {
            (function(c){
              switch(maps[c].type)
              {
                case 'text':
                  maps[c].parent.addAttrUpdateListener('html',function(e){
                    if(maps[c].element.parentElement === undefined)
                    {
                      maps.splice(c,1);
                      return;
                    }

                    if(maps[c].element.childNodes.length === 1 && maps[c].bindTexts.length === 1)
                    {
                      /* set vm */
                      vm.getLayer(e.key)[e.key.split('.').pop()] = e.value;
                    }
                  });

                  /* set text and listen data */

                  maps[c].target[maps[c].listener] = getValue(maps[c].bindTexts,vm);

                break;
                case 'attribute':
                  /* if the attribute wanting to take for binding happens to be an event, replace with standard for mapping */
                  if(maps[c].listener.indexOf('on') === 0)
                  {
                    maps[c].element.setAttribute(maps[c].listener.replace('on',''),maps[c].element.getAttribute(maps[c].listener));
                    maps[c].element.removeAttribute(maps[c].listener);
                    maps[c].listener = maps[c].listener.replace('on','');

                    /* set event and listen data */

                  }
                  maps[c].element.addAttrUpdateListener(maps[c].listener,function(e){
                    if(maps[c].bindTexts.length === 1)
                    {
                      /* set vm */
                    }
                  });

                  /* set attr and listen data */
                break;
                case 'component':
                  /* just set value, no listen for data, future case propogate value binding down */
                break;
                case 'for':
                  /* complicated for mapping */
                break;
              }
            }(x))
          }
      }

      function getInnerComponents()
      {

      }

      function init(name,node)
      {
        __mappedAttrs = _mapper(node);
        node.replaceWith(__mappedAttrs.wrapper);
        mapTargets(__mappedAttrs.wrapper,__mappedAttrs.maps,createViewmodel(name,_viewmodels[name],params,pre,post));
        getInnerComponents(__mappedAttrs.wrapper);
      }

      if(!_mapper.isRegistered(__name))
      {
        Konnekt.loadWaitList(__name,function(n,c){
          init(__name,node);
        });
        _Loader(__name);
      }
      else
      {
        init(__name,node);
      }

    }

    function setDescriptor(value,writable,redefinable)
    {
      return {
          value:value,
          writable:!!writable,
          enumerable:false,
          configurable:!!redefinable
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

    function onComponentLoad(name,component)
    {
      var template = "<style>"+component.prototype.k_css+"</style>"+component.prototype.k_html;
      Konnekt.register(name,component,template,component.prototype.cms)
      Konnekt.loadWaitList(name)(name,component);
      Konnekt.loadWaitList(name,function(){});
    }

    /* Registers name to a component */
    Konnekt.register = function(name,vm,template,cms)
    {
      _mapper.register(name,template);
      _viewmodels[name] = vm;
      if(cms) _cms[name] = cms;
      return Konnekt;
    }

    /* register for a component to load and be registered */
    Konnekt.loadWaitList = function(name,v){
      if(typeof v === 'undefined' && name) return _waitList[name];
      if(name) _waitList[name] = (typeof v === 'function' ? v : _waitList[name]);
      return Konnekt;
    }

    return Konnekt;
  }
  return CreateKonnekt;
});

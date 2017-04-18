define(['KonnektDT','KonnektMP','KonnektRTF'],function(CreateData,CreateMapping,CreateHashRouting){

  function CreateKonnekt(localRouter,hashroute)
  {
    if(!window.K_Components) window.K_Components = {};

    /* Our mixed observable data library */
    var _mixed = CreateData(),

        /* mapping library, for mapping new component: new _mapper(componentNode) */
        _mapper = CreateMapping(),

        /* routes components based on the current url hash, config.base sets the default route of '/' */
        _hashrouter = CreateHashRouting()
        .base((config !== undefined && config.base !== undefined ? config.base : 'default'))
        .watch(true)
        .onChange(function(name){
          Konnekt(document.querySelector(name));
        }),

        /* this is a main model, data sets will be stored here for sharing between components and other libraries through this.store = true attribute */
        _model = _mixed({},"Model"),

        /* we can get a list of all possibe events from the HTMLElement prototype */
        _events = Object.keys(HTMLElement.prototype)
                  .filter(function(prop){
                    /* we filter for 'on' properties as these are all events */
                    return (prop.indexOf('on') === 0);
                  }),

        /* the current loaded viewmodels */
        _viewmodels = {},

        /* this will be used later for current loaded cms components */
        _cms = {},

        /* important ignore list for when creating a viewmodel, these attributes are not used for binding */
        _ignoreList = ['id','filters','class','sessionStorage','localStorage','store','component','multiple'],

        /* url query attached to web addres: ?env=dev etc */
        _query = getQuery(),

        _waitList = {},

        _baserouter;


    function Konnekt(node,predt,postdt)
    {
      /* REGION set data points */

      /* name of the component */
      var __name = node.tagName.toLowerCase(),

          /* the mapped binds */
          __mappedAttrs,

          /* Pre -- all about built in data this will be allocated later to seperate file */ /* Note** we may need to take another look at this as mixed pointers are being double processed */
          __pre = (predt || {}),

          /* post all about post set data and pointers */ /* Note** we may need to take another look at this as mixed pointers are being double processed */
          __post = (postdt || {}),

          __params = [];

      /* PRE DATA Only */

      Object.defineProperty(__pre,'local',setDescriptor((__name+"-"+Date.now()),true,false,true));

      /* base core filters usable in all components */
      Object.defineProperty(__pre,'filters',setDescriptor((__pre.filters || {}),false,false,true));

      Object.defineProperty(__pre,'onFinish',setDescriptor((__pre.onFinish || function(){}),true,false,true));

      if(typeof __pre.sessionStorage === 'string') __pre.sessionStorage = (__pre.sessionStorage === 'true');
      Object.defineProperty(__pre,'sessionStorage',setDescriptor((__pre.sessionStorage !== undefined ? __pre.sessionStorage : false),true,false,true));

      /* whether to attempt to store data in localStorage */
      if(typeof __pre.localStorage === 'string') __pre.localStorage = (__pre.localStorage === 'true');
      Object.defineProperty(__pre,'localStorage',setDescriptor((__pre.localStorage !== undefined ? __pre.localStorage : false),true,false,true));

      /* whether to attempt to store data in the model */
      if(typeof __pre.store === 'string') __pre.store = (__pre.store === 'true');
      Object.defineProperty(__pre,'store',setDescriptor((__pre.store !== undefined ? __pre.store : false),true,false,true));

      /* if this component can have children components of the same type, to prevent recursion */
      if(typeof __pre.multiple === 'string') __pre.multiple = (__pre.multiple === 'true');
      Object.defineProperty(__pre,'multiple',setDescriptor((__pre.multiple !== undefined ? __pre.multiple : false),true,false,true));

      /* POST DATA Only */

      /* if the component contained any innerHTML this gets placed into a post bindable */
      __post.innerHTML = Array.prototype.slice.call(node.childNodes);

      for(var x=0,len=node.attributes.length;x<len;x++)
      {
        __post[node.attributes[x].name] = node.attributes[x].value;
      }

      for(var x=0,len=_events.length;x<len;x++)
      {
        if(!!node[_events[x]]) __post[_events[x]] = node[_events[x]];
      }

      /* add any data attached to k_post  property */
      if(node.k_post) passKeys(node.k_post,__post);

      /* ENDREGION set data points */

      function init(name,node)
      {
        /* Create node template and map the inner nodes of the template */
        __mappedAttrs = new _mapper(node);

        /* define component tree for multiples later */
        Object.defineProperty(__mappedAttrs.wrapper,'__kbcomponenttree',setDescriptor(node.kb_mapper ? node.kb_mapper.__kbcomponenttree.slice() : []));

        /* add new nodes to params for passing to viewmodels */
        __params.unshift(__mappedAttrs.wrapper);

        /* map targets connects the viewmodel data to the dom and vice versa */
        mapTargets(__mappedAttrs.wrapper,__mappedAttrs,createViewmodel(name,_viewmodels[name],__params,__pre,__post));

        /* replace original node with new templated node */
        node.parentElement.replaceChild(__mappedAttrs.fragment,node);

        /* check for multiples */
        if(__mappedAttrs.wrapper.__kbcomponenttree.indexOf(name) === -1 || __mappedAttrs.wrapper.kb_viewmodel.multiple)
        {
          /* add to component tree and search for inner unkown components */
          __mappedAttrs.wrapper.__kbcomponenttree.push(name);
          __mappedAttrs.wrapper.classList.add(__mappedAttrs.wrapper.kb_viewmodel.local);
          getInnerComponents(__mappedAttrs.wrapper);
        }
        else
        {
          console.error("Warning!! You are attempting to make a recursive component %o, recursive components can lead to memory stack overflows unless properly handled, Please check your components html for use of this component, if You want this to be a recursive component please set `this.multiple = true;`",name);
          console.error("Recursive Component %o on %o",__mappedAttrs.wrapper,__mappedAttrs.wrapper.parentElement);
        }
      }

      function getInnerComponents(node)
      {
        var nodes = node.querySelectorAll('*');
        for(var x=0,len=nodes.length;x<len;x++)
        {
          if(nodes[x] instanceof HTMLUnknownElement)
          {
            Konnekt(nodes[x]);
          }
        }
      }
      
      function loadLoopComponent(node,cb)
      {
        var name = node.tagName.toLowerCase();
        if(!_mapper.isRegistered(name))
        {
          Konnekt.loadWaitList(name,function(n,c){
            init(name,node);
            if(cb) cb();
          });
        }
        else
        {
          init(name,node);
          if(cb) cb();
        }
      }
      
      function mapTargets(node,maps,vm)
      {
        node.kb_viewmodel = vm;
        node.innerHTML = maps.template.replace(new RegExp('('+_mapper.start()+'local'+_mapper.end()+')','g'),vm.local);

        /* map nodes with their bindings */
        node.kb_maps = maps.maps = maps.map(node);
        
        for(var x=0,keys =Object.keys(node.kb_maps),len=keys.length;x<len;x++)
        {
          var _key = keys[x];
          for(var i=0,lenn=node.kb_maps[_key].length;i<lenn;i++)
          {
            (function(map){
              switch(map.type)
              {
                case 'for':
                  map._data = vm;
                  if(!_mapper.isRegistered(map.component))
                  {
                    Konnekt.loadWaitList(map.component,function(n,c){
                      map.connect(vm,loadLoopComponent).loop(function(node){
                        Konnekt(node);
                      });
                    });
                  }
                  else
                  {
                    map.connect(vm,loadLoopComponent).loop(function(node){
                      Konnekt(node);
                    });
                  }
                break;
                case 'component':
                  map.connect(vm).unsync();
                break;
                default:
                  map.connect(vm);
                break;
              }
            }(node.kb_maps[_key][i]))
          }
        }
        vm.onFinish.call(vm,node);
      }

      if(!_mapper.isRegistered(__name))
      {
        Konnekt.loadWaitList(__name,function(n,c){
          init(__name,node);
        });
      }
      else
      {
        init(__name,node);
      }
    }

    /* HELPERS */
    function getQuery()
    {
      var _search = window.location.search.replace('?','').split('&'),
          _query = {},
          _curr;

      for(var x=0,len=_search.length;x<len;x++)
      {
        if(_search[x].length !== 0)
        {
          _curr = _search[x].split('=');
          _query[_curr[0]] = _curr[1];
        }
      }
      return _query;
    }

    function setDescriptor(value,writable,redefinable,enumerable)
    {
      return {
          value:value,
          writable:!!writable,
          enumerable:!!enumerable,
          configurable:!!redefinable
      }
    }

    function passKeys(obj,obj2)
    {
      var keys = Object.keys(obj).filter(function(key){return (key !== 'pointers');});

      if(!obj2.pointers) obj2.pointers = {};

      for(var x=0,len=keys.length;x<len;x++)
      {
        if(_mixed.prototype.isObservable(keys[x]))
        {
          obj2.pointers[keys[x]] = obj;
        }
        else if(_mixed.prototype.isMixed(obj[keys[x]]))
        {
          obj2.pointers[keys[x]] = obj[keys[x]].__kbImmediateParent;
        }
        else
        {
          if(_mixed.prototype.isObject(obj[keys[x]]))
          {
            for(var i=0,keysI=Object.keys(obj[keys[x]]),lenI=keysI.length;i<len;i++)
            {
              obj2[keys[x]][keysI[i]] = obj[keys[x]][keysI[i]];
            }
          }
          else if(_mixed.prototype.isArray(obj[keys[x]]))
          {
            for(var i=0,lenI=obj[keys[x]].length;i<len;i++)
            {
              obj2[keys[x]][i] = obj[keys[x]][i];
            }
          }
          else
          {
            obj2[keys[x]] = obj[keys[x]];
          }
        }
      }
      
      if(obj.pointers)
      {
        keys = Object.keys(obj.pointers);
        for(var x=0,len=keys.length;x<len;x++)
        {
          obj2.pointers[keys[x]] = obj.pointers[keys[x]];
        }
      }
    }

    /* The main viewmodel constructor */
    function createViewmodel(name,component,params,pre,post)
    {
        /* creates blank observable data set */
        var obsv = _mixed({},name);

        /* if there are any prototypes on this component they are added to the Data sets prototype */
        for(var x=0,keys=Object.keys(component.prototype),len=keys.length;x<len;x++)
        {
          obsv.__proto__[keys[x]] = component.prototype[keys[x]];
        }

        /* Attach Pre properties, or pre designed attachments for every Data set */
        for(var x=0,keys=Object.keys(pre),len=keys.length;x<len;x++)
        {
          if(_ignoreList.indexOf(keys[x]) !== -1)
          {
            Object.defineProperty(obsv,keys[x],setDescriptor(pre[keys[x]],(keys[x] !== 'filters')));
          }
          else
          {
            obsv.set(keys[x],pre[keys[x]]);
          }
        }

        if(pre.pointers)
        {
          for(var x=0,keys=Object.keys(pre.pointers),len=keys.length;x<len;x++)
          {
            obsv.addPointer(pre.pointers[keys[x]],keys[x]);
          }
        }

        /* we then apply the component constructor to the data set in order to add the 'this' properties from it and pass in the params */
        component.apply(obsv,params);

        /* Post attachments, overwritables, for data or pointers */
        for(var x=0,keys=Object.keys(post),len=keys.length;x<len;x++)
        {
          if(_ignoreList.indexOf(keys[x]) !== -1)
          {
            Object.defineProperty(obsv,keys[x],setDescriptor(post[keys[x]],(keys[x] !== 'filters')));
          }
          else
          {
            obsv.set(keys[x],post[keys[x]]);
          }
        }

        /* post pointers */
        if(post.pointers)
        {
          for(var x=0,keys=Object.keys(post.pointers),len=keys.length;x<len;x++)
          {
            obsv.addPointer(post.pointers[keys[x]],keys[x]);
          }
        }

        /* map filters as binded to vm */
        for(var x=0,keys=Object.keys(obsv.filters),len=keys.length;x<len;x++)
        {
          obsv.filters[keys[x]] = obsv.filters[keys[x]].bind(obsv);
        }

        /* Apply session storage if set, this allows for storing this vm in session storage, only those values that are enumerable */
        if(obsv.sessionStorage)
        {
            var storage = sessionStorage.getItem((obsv.id || name));

            /* load storage into the data set if it is set */
            if(storage)
            {
                storage = JSON.parse(storage);
                for(var x=0,keys=Object.keys(storage),len=keys.length;x<len;x++)
                {
                    obsv.set(keys[x],storage[keys[x]]);
                }
            }

            /* set the storage object with the defaults */
            else
            {
                sessionStorage.setItem((obsv.id || name),obsv.stringify());
            }

            /* if any data updates then the storage will be updated along with it */
            obsv.addChildDataUpdateListener('*',function(){
                sessionStorage.setItem((obsv.id || name),obsv.stringify());
            });
        }

        /* Apply local storage if set, similiar to session Storage except this persists even after browser is closed */
        if(obsv.localStorage)
        {
            var storage = localStorage.getItem((obsv.id || name));

            /* load storage into the data set if it is set */
            if(storage)
            {
                storage = JSON.parse(storage);
                for(var x=0,keys=Object.keys(storage),len=keys.length;x<len;x++)
                {
                    obsv.set(keys[x],storage[keys[x]]);
                }
            }

            /* set the storage object with the defaults */
            else
            {
                localStorage.setItem((obsv.id || name),obsv.stringify());
            }

            /* if any data updates then the storage will be updated along with it */
            obsv.addChildDataUpdateListener('*',function(){
                localStorage.setItem((obsv.id || name),obsv.stringify());
            });
        }

        if(obsv.store)
        {
            /* adds a pointer in model to this viewmodel, look into using id as an id from component: <test id="storeid"></test> */
            _model.set((obsv.id || name),obsv);
        }

        return obsv;
      }

    /* Loaders */
    function onComponentLoad(name,component,el)
    {
      var template = "<style>"+unescape(component.prototype.k_css)+"</style>"+unescape(component.prototype.k_html);
      Konnekt.register(name,component,template,component.prototype.cms);
      
      Konnekt.loadWaitList(name).forEach(function(onload){
        onload(name,component);
      });
      Konnekt.loadWaitList(name,'clear');
    }

    function loadComponent(name)
    {
      if(!K_Components[name])
      {
        loadUrl(name,'component/'+name+'/'+location.search,onComponentLoad);
      }
      else
      {
        onComponentLoad(name,K_Components[name],document.getElementById('script_'+name));
      }
    }

    function loadUrl(name,url,cb)
    {
      function createNode(name,src,fn)
      {
        var node = document.createElement('script');
        node.type = 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        node.src = src;
        node.id = 'script_'+name;
        node.onload = function(){fn(name,K_Components[name],this);};
        return node;
      }

      document.head.appendChild(createNode(name,url,cb));
    }

    /* Methods */

    /* Registers name to a component */
    Konnekt.register = function(name,vm,template,cms)
    {
      _mapper.register(name,template);
      _viewmodels[name] = vm;
      if(cms) _cms[name] = cms;
      return Konnekt;
    }

    /* register for a component to load and be registered */
    Konnekt.loadWaitList = function(name,v)
    {
      if(typeof v === 'undefined' && name) return _waitList[name];
      if(name)
      {
        if(_waitList[name] === undefined || v === 'clear')
        {
          if(_waitList[name] === undefined) loadComponent(name);
          var loaded = (_waitList[name] === undefined ? false : !!_waitList[name].loading);
          _waitList[name] = [];
          _waitList[name].loading = loaded;
        }
        if(typeof v === 'function') _waitList[name].push(v);
      }
      return Konnekt;
    }

    Konnekt.localRouting = function(isRouting)
    {
      if(isRouting)
      {
        _baserouter = Node.prototype.appendChild;
        Node.prototype.appendChild = function(node)
        {
          if(node.nodeName.toLowerCase() === 'script')
          {
            node.src = node.src.substring(0,(node.src.indexOf('?') !== -1 ? node.src.indexOf('?') : node.src.length));
            var match = node.src.match(/(.*?component\/)/);
            if(match)
            {
              if(!_query.env) _query.env = 'prod';
              if(_query.env === 'dev') _query.env = 'qa';

              var name = node.src.replace(match[0],'').replace(/[\/\s]/g,'');

              node.src = '/components/' + name+'/build/'+_query.env+'/'+name+(!_query.debug || _query.env === 'prod' ? '.min' : '')+'.js';
              arguments[0] = node;
            }
          }
          return _baserouter.apply(this,arguments);
        }
      }
      else
      {
        if(_baserouter)
        {
          Node.prototype.appendChild = _baserouter;
          _baserouter = null;
        }
      }
      return Konnekt;
    }

    Konnekt.hashRouting = function(isHashed)
    {
      if(isHashed)
      {
         _hashrouter(window.location.hash.replace('#',''));
      }
    }

    return Konnekt;
  }
  return CreateKonnekt;
});

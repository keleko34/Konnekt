/* Build */
/* End Build */
define(['KonnektDT','KonnektL','kb','KonnektMP','KonnektRTF'],function(CreateData,CreateLoader,kb,CreateMapping,CreateHashRouting){

  function CreateKonnekt(config)
  {
    if(!window.K_Components) window.K_Components = {};
    
    /* main loader for loading files */
    var _Loader = CreateLoader().onLoad(onComponentLoad),
        
        /* Our mixed observable data library */
        _mixed = CreateData(),
        
        _config = config | {},
        
        /* mapping library, for mapping new component: new _mapper(componentNode) */
        _mapper = CreateMapping().addEventListener('loopitem',function(e){
          var name = e.node.tagName.toLowerCase();
          if(!Konnekt.isRegistered(name) && !e.node.kb_isLoading)
          {
            e.node.kb_isLoading = true;
            Konnekt.loadWaitList(name,function(n,c){
              Konnekt(e.node);
            });
            if(!Konnekt.loadWaitList(name).loading) 
            {
              Konnekt.loadWaitList(name).loading = true;
              _Loader(name);
            }
          }
          else
          {
            if(Konnekt.isRegistered(name)) Konnekt(e.node);
          }
        }),
        
        /* routes components based on the current url hash, config.base sets the default route of '/' */
        _hashrouter = CreateHashRouting()
        .base((_config.base !== undefined ? _config.base : 'default'))
        .watch(true)
        .onChange(function(name){
          Konnekt(document.querySelector(name));
        }),
        
        /* this is a main model, data sets will be stored here for sharing between components and other libraries through this.store = true attribute */
        _model = _mixed({},"Model"),
        
        /* the current loaded viewmodels */
        _viewmodels = {},
        
        /* this will be used later for current loaded cms components */
        _cms = {},
        
        /* url query attached to web addres: ?env=dev etc */
        _query = getQuery(),
        
        /* important ignore list for when creating a viewmodel, these attributes are not used for binding */
        _ignoreList = ['id','filters','class','sessionStorage','localStorage','store','component','multiple'],
        
        /* used for onload events, when a component has not been loaded from the server a request for load is made and the current script is placed in the waitlist until it has been loaded from the server to continue operation */
        _waitList = {},

        _baserouter;

    /* This method will Create page, Create Viewmodel, attach binds, check children, load files, rinse, repeat */
    function Konnekt(node,params,predt,postdt)
    {
      /* name of the component */
      var __name = node.tagName.toLowerCase(),
          
          /* the mapped binds */
          __mappedAttrs,
          
          /* we can get a list of all possibe events from the HTMLElement prototype */
          __events = Object.keys(HTMLElement.prototype)
          .filter(function(prop){
            /* we filter for 'on' properties as these are all events */
            return (prop.indexOf('on') === 0);
          }),
          
          /* Pre -- all about built in data this will be allocated later to seperate file */ /* Note** we may need to take another look at this as mixed pointers are being double processed */
          pre = {},
          
          /* post all about post set data and pointers */ /* Note** we may need to take another look at this as mixed pointers are being double processed */
          post = {};
      
      /* params are extra information passed to the viewmodel constructor, example: componentNode */
      if(params === undefined) params = [];
      
      if(predt) passKeys(predt,pre);
      
      Object.defineProperty(pre,'local',setDescriptor(pre.local || (__name+"-"+Date.now()),true,false,true));
      
      /* base core filters usable in all components */
      
      Object.defineProperty(pre,'filters',setDescriptor(pre.filters || {},false,false,true));
      
      
      if(typeof pre.onFinish !== 'function') pre.onFinish = function(){};
      Object.defineProperty(pre,'onFinish',setDescriptor(pre.onFinish,true,false,true));

      /* whether to attempt to store data in sessionStorage */
      if(typeof pre.sessionStorage === 'string') pre.sessionStorage = (pre.sessionStorage === 'true');
      Object.defineProperty(pre,'sessionStorage',setDescriptor((pre.sessionStorage !== undefined ? pre.sessionStorage : false),true,false,true));

      /* whether to attempt to store data in localStorage */
      if(typeof pre.localStorage === 'string') pre.localStorage = (pre.localStorage === 'true');
      Object.defineProperty(pre,'localStorage',setDescriptor((pre.localStorage !== undefined ? pre.localStorage : false),true,false,true));

      /* whether to attempt to store data in the model */
      if(typeof pre.store === 'string') pre.store = (pre.store === 'true');
      Object.defineProperty(pre,'store',setDescriptor((pre.store !== undefined ? pre.store : false),true,false,true));

      /* if this component can have children components of the same type, to prevent recursion */
      if(typeof pre.multiple === 'string') pre.multiple = (pre.multiple === 'true');
      Object.defineProperty(pre,'multiple',setDescriptor((pre.multiple !== undefined ? pre.multiple : false),true,false,true));
      
      if(postdt) passKeys(postdt,post);
      
      /* if the component contained any innerHTML this gets placed into a post bindable */
      post.innerHTML = Array.prototype.slice.call(node.childNodes);
      
      for(var x=0,len=node.attributes.length;x<len;x++)
      {
        post[node.attributes[x].name] = node.attributes[x].value;
      }
      
      /* add all events to post for binding to inner component */
      for(var x=0,len=__events.length;x<len;x++)
      {
        if(node[__events[x]]) post[__events[x]] = node[__events[x]];
      }
      
      /* add any data attached to k_post  property */
      if(node.k_post) passKeys(node.k_post,post);
      
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
            if(pre.pointers)
            {
              if(pre.pointers[keys[x]] === undefined) obsv.set(keys[x],pre[keys[x]]);
            }
            else
            {
              obsv.set(keys[x],pre[keys[x]]);
            }
          }
        }
        
        if(pre.pointers)
        {
          if(!obsv.pointers) Object.defineProperty(obsv,'pointers',setDescriptor({},false,true));
          for(var x=0,keys=Object.keys(pre.pointers),len=keys.length;x<len;x++)
          {
            obsv.pointers[keys[x]] = pre.pointers[keys[x]];
            obsv.addPointer(obsv.pointers[keys[x]].point,obsv.pointers[keys[x]].key,keys[x]);
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
            if(post.pointers)
            {
              if(post.pointers[keys[x]] === undefined) obsv.set(keys[x],post[keys[x]]);
            }
            else
            {
              obsv.set(keys[x],post[keys[x]]);
            }
          }
        }
        
        /* post pointers */
        if(post.pointers)
        {
          if(!obsv.pointers) Object.defineProperty(obsv,'pointers',setDescriptor({},false,true));
          for(var x=0,keys=Object.keys(post.pointers),len=keys.length;x<len;x++)
          {
            obsv.pointers[keys[x]] = post.pointers[keys[x]];
            obsv.addPointer(obsv.pointers[keys[x]].point,obsv.pointers[keys[x]].key,keys[x]);
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
      
      function getInnerMapper(name)
      {
        return new RegExp('('+_mapper.start()+'>'+name+'(.*?)'+_mapper.end()+')','g');
      }
      
      function innerMapperKeys()
      {
        return new RegExp('('+_mapper.start()+'>(.*?)'+_mapper.end()+')','g');
      }
      
      /* in charge of connecting the viewmodel up to the allocated maps */
      function mapTargets(target,mappedAttrs,vm)
      {
        /* attaches viewmodel to wrapper */
        target.kb_viewmodel = vm;
        
        /* do a replace for simple initial replacements inside binds */
        mappedAttrs.wrapper.innerHTML = _mapper.insert(mappedAttrs.template,vm);
        
        /* map nodes with their bindings */
        var maps = mappedAttrs.maps = mappedAttrs.map(mappedAttrs.wrapper);

        mappedAttrs.wrapper.kb_maps = maps;
        
        /* loops through maps: {key:[map,map],key2:[map,map]} */
        Object.keys(maps).forEach(function(key){
          maps[key].forEach(function(map){
            switch(map.type)
            {
              case 'for':
                /* connects viewmodel and then loop creates components for converting and deletes original map*/
                map.connect(vm).createloop();
              break;
              case 'component':
                /* connects viewmodel updates value and then deletes map as it won't be used again */
                map.connect(vm).unsync();
              break;
              default:
                /* standard data connection and value set */
                map.connect(vm);
              break;
            }
          })
        });
        
        mappedAttrs.wrapper.kb_viewmodel.onFinish.call(mappedAttrs.wrapper.kb_viewmodel,mappedAttrs.wrapper);
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

      function init(name,node)
      {
        /* Create node template and map the inner nodes of the template */
        __mappedAttrs = new _mapper(node,true);
        
        /* define component tree for multiples later */
        Object.defineProperty(__mappedAttrs.wrapper,'__kbcomponenttree',setDescriptor(node.kb_mapper ? node.kb_mapper.__kbcomponenttree.slice() : []));
        
        /* replace original node with new templated node */
        node.parentElement.replaceChild(__mappedAttrs.fragment,node);
        
        /* add new nodes to params for passing to viewmodels */
        params.unshift(__mappedAttrs.wrapper);
        
        /* map targets connects the viewmodel data to the dom and vice versa */
        mapTargets(__mappedAttrs.wrapper,__mappedAttrs,createViewmodel(name,_viewmodels[name],params,pre,post));
        
        /* check for multiples */
        if(__mappedAttrs.wrapper.__kbcomponenttree.indexOf(name) === -1 || __mappedAttrs.wrapper.kb_viewmodel.multiple)
        {
          /* add to component tree and search for inner unkown components */
          __mappedAttrs.wrapper.__kbcomponenttree.push(name);
          __mappedAttrs.wrapper.className += (" "+__mappedAttrs.wrapper.kb_viewmodel.local);
          __mappedAttrs.wrapper.className += (!!__mappedAttrs.wrapper.kb_viewmodel.loopid ? " "+__mappedAttrs.wrapper.kb_viewmodel.loopid : "");
          getInnerComponents(__mappedAttrs.wrapper);
        }
        else
        {
          console.error("Warning!! You are attempting to make a recursive component %o, recursive components can lead to memory stack overflows unless properly handled, Please check your components html for use of this component, if You want this to be a recursive component please set `this.multiple = true;`",name);
          console.error("Recursive Component %o on %o",__mappedAttrs.wrapper,__mappedAttrs.wrapper.parentElement);
          __mappedAttrs.wrapper.parentElement.removeChild(__mappedAttrs.wrapper);
        }
      }

      if(!Konnekt.isRegistered(__name) && !node.kb_isLoading)
      {
        Konnekt.loadWaitList(__name,function(n,c){
          init(__name,node);
        });
        if(!Konnekt.loadWaitList(__name).loading) 
        {
          Konnekt.loadWaitList(__name).loading = true;
          _Loader(__name);
        }
      }
      else
      {
        if(Konnekt.isRegistered(__name)) init(__name,node);
      }
    }
    
    function passKeys(obj,obj2)
    {
      var keys = Object.keys(obj);
      
      if(!obj2.pointers) Object.defineProperty(obj2,'pointers',{value:{},writable:true,enumerable:false,configurable:true});
      
      for(var x=0,len=keys.length;x<len;x++)
      {
        if(_mixed.prototype.isObservable(obj,keys[x]))
        {
          obj2.pointers[keys[x]] = {key:obj.__kbscopeString.split('.').pop(),point:obj.__kbImmediateParent};
        }
        else if(_mixed.prototype.isMixed(obj[keys[x]]))
        {
          obj2.pointers[keys[x]] = {key:obj[keys[x]].__kbscopeString.split('.').pop(),point:obj[keys[x]].__kbImmediateParent};
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
      var template = "<style>"+unescape(component.prototype.k_css)+"</style>"+unescape(component.prototype.k_html);
      Konnekt.register(name,component,template,component.prototype.cms);
      
      /*_mapper.getUnkowns(template).forEach(function(u){
        _Loader(u);
      });*/
      
      
      Konnekt.loadWaitList(name).forEach(function(onload){
        onload(name,component);
      });
      Konnekt.loadWaitList(name,'clear');
    }

    /* Registers name to a component */
    Konnekt.register = function(name,vm,template,cms)
    {
      _mapper.register(name,template);
      _viewmodels[name] = vm;
      if(cms) _cms[name] = cms;
      return Konnekt;
    }
    
    Konnekt.isRegistered = function(name)
    {
      return (_viewmodels[name] !== undefined && _mapper.isRegistered(name));
    }
    
    Konnekt.registered = function()
    {
      return Object.keys(_viewmodels);
    }

    /* register for a component to load and be registered */
    Konnekt.loadWaitList = function(name,v)
    {
      if(typeof v === 'undefined' && name) return _waitList[name];
      if(name)
      {
        if(_waitList[name] === undefined || v === 'clear')
        {
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
              
              node.src = (_config.prefix !== undefined ? _config.prefix : '')+'/components/' + name+'/build/'+_query.env+'/'+name+(!_query.debug || _query.env === 'prod' ? '.min' : '')+'.js';
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
        if(!document.body)
        {
          document.addEventListener('DOMContentLoaded',function(){
            _hashrouter(window.location.hash.replace('#',''));
          });
        }
        else
        {
          _hashrouter(window.location.hash.replace('#',''));
        }
      }
    }

    return Konnekt;
  }
  return CreateKonnekt;
});

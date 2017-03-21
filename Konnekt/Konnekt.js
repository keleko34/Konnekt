/* Build */
/* End Build */
define(['KonnektDT','KonnektL','KonnektMP'],function(CreateData,CreateLoader,CreateMapping){

  function CreateKonnekt()
  {
    if(!window.K_Components) window.K_Components = {};
    
    /* main loader for loading files */
    var _Loader = CreateLoader().onLoad(onComponentLoad),
        
        /* Our mixed observable data library */
        _mixed = CreateData(),
        
        /* mapping library, for mapping new component: new _mapper(componentNode) */
        _mapper = CreateMapping(),
        
        /* this is a main model, data sets will be stored here for sharing between components and other libraries through this.store = true attribute */
        _model = _mixed({},"Model"),
        
        /* the current loaded viewmodels */
        _viewmodels = {},
        
        /* this will be used later for current loaded cms components */
        _cms = {},
        
        /* url query attached to web addres: ?env=dev etc */
        _query = getQuery(),
        
        /* important ignore list for when creating a viewmodel, thes attributes are not used for binding */
        _ignoreList = ['id','filters','class','sessionStorage','localStorage','store','component'],
        
        /* used for onload events, when a component has not been loaded from the server a request for load is made and the current script is placed in the waitlist until it has been loaded from the server to continue operation */
        _waitList = {};

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
      
      if(!pre.id) Object.defineProperty(pre,'id',setDescriptor((__name+"-"+Date.now())));
      
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
      
      if(postdt) passKeys(postdt,post);
      
      /* if the component contained any innerHTML this gets placed into a post bindable */
      post.innerHTML = node.innerHTML.toString();
      
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
          obsv.set(keys[x],pre[keys[x]]);
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
          obsv.set(keys[x],post[keys[x]]);
        }

        if(post.pointers)
        {
          for(var x=0,keys=Object.keys(post.pointers),len=keys.length;x<len;x++)
          {
            obsv.addPointer(post.pointers[keys[x]],keys[x]);
          }
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
      
      /* in charge of connecting the viewmodel up to the allocated maps */
      function mapTargets(target,maps,vm)
      {
        /* attaches viewmodel to wrapper */
        target.kb_viewmodel = vm;
        
        /* loops through maps: {key:[map,map],key2:[map,map]} */
        Object.keys(maps).forEach(function(key){
          maps[key].forEach(function(map){
            switch(map.type)
            {
              case 'for':
                /* connects viewmodel and then loop creates components for converting and deletes original map*/
                map.connect(vm)
                if(!_mapper.isRegistered(map.component))
                {
                    Konnekt.loadWaitList(map.component,function(n,c){
                      map.loop(function(node){
                        Konnekt(node);
                      });
                    });
                    _Loader(map.component);
                }
                else
                {
                  map.loop(function(node){
                        Konnekt(node);
                      });
                }
              break;
              case 'component':
                /* connects viewmodel updates value and then deletes map as it won't be used again */
                map.connect(vm).deleteMap();
              break;
              default:
                /* standard data connection and value set */
                map.connect(vm);
              break;
            }
          })
        });
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
        __mappedAttrs = new _mapper(node);
        node.parentElement.replaceChild(__mappedAttrs.fragment,node);
        params.unshift(__mappedAttrs.wrapper);
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
    
    function passKeys(obj,obj2)
    {
      var keys = Object.keys(obj);
      
      if(!obj2.pointers) obj2.pointers = {};
      
      for(var x=0,len=keys.length;x<len;x++)
      {
        if(obj.isObservable(keys[x]))
        {
          obj2.pointers[keys[x]] = obj;
        }
        else if(obj[keys[x]].isMixed())
        {
          obj2.pointers[keys[x]] = obj[keys[x]].__kbImmediateParent;
        }
        else
        {
          obj2[keys[x]] = obj[keys[x]];
        }
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
      var template = "<style>"+unescape(component.prototype.k_css)+"</style>"+unescape(component.prototype.k_html);
      Konnekt.register(name,component,template,component.prototype.cms);
      
      /*_mapper.getUnkowns(template).forEach(function(u){
        _Loader(u);
      });*/
      
      
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

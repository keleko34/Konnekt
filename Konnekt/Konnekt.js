/* Build */
/* End Build */

/* KonnektDT
   :handles vm data
   
   KonnektL
   :handles loading of the components
   
   kb
   :handles the binding events of the entire dom
   
   KonnektMP
   :handles the creation of mapping objects
   
   KonnektRTF
   :handles frontend routing system and backend file routing if specified*/
define(['KonnektDT','KonnektL','kb','KonnektMP','KonnektRTF'],function(CreateData,CreateLoader,kb,CreateMapping,CreateHashRouting){

  function CreateKonnekt(config)
  {
    /* holds all base components for loading */
    if(!window.K_Components) window.K_Components = {};
    
    /* main loader for loading files */
    var _Loader = CreateLoader().onLoad(onComponentLoad),
        
        /* Our mixed observable data library */
        _mixed = CreateData(),
        
        _config = config || {},
        
        _fetchedConfigs = false,
        
        _onConfigsFetched = [],
        
        /* mapping library, for mapping new component: new _mapper(componentNode) */
        _mapper = CreateMapping()
        .addEventListener('loopitem',buildNode)
        .addEventListener('replaceNode',buildNode),
        
        /* routes components based on the current url hash, config.base sets the default route of '/' */
        _hashrouter = CreateHashRouting()
        .base((_config.base !== undefined ? _config.base : 'default'))
        .watch(true)
        .onChange(function(name){
          Konnekt(document.querySelector(name));
        }),
        
        /* this is a main model, data sets will be stored here for sharing between components and other libraries through this.store = true attribute or a user specifying [~name] filter option */
        _model = _mixed({},"Model"),
        
        /* the current loaded viewmodels */
        _viewmodels = {},
        
        /* this will be used later for current loaded cms components */
        _cms = {},
        
        /* handles standard message event buses */
        _messages = {},
        
        /* handles more specific node scoped event buses */
        _scopemessages = {},
        
        /* url query attached to web addres: ?env=dev etc */
        _query = getQuery(),
        
        /* important ignore list for when creating a viewmodel, these attributes are not used for binding */
        _ignoreList = ['id','filters','class','sessionStorage','localStorage','store','component','multiple'],
        
        /* used for onload events, when a component has not been loaded from the server a request for load is made and the current script is placed in the waitlist until it has been loaded from the server to continue operation */
        _waitList = {},

        _baserouter;

    /* This method will Create page, Create Viewmodel, attach binds, check children, load files, rinse, repeat */
    function Konnekt(node,params,predt,postdt,cb)
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
          pre = passKeys(_config,{}),
          
          /* post all about post set data and pointers */ /* Note** we may need to take another look at this as mixed pointers are being double processed */
          post = {};
      
      /* params are extra information passed to the viewmodel constructor, example: componentNode */
      if(params === undefined) params = [];
      
      if(predt) passKeys(predt,pre);
      
      Object.defineProperty(pre,'local',setDescriptor(pre.local || ("local_"+__name+"-"+(Math.floor(Math.random() * Date.now()) + 1)),true,false,true));
      Object.defineProperty(pre,'id',setDescriptor(pre.id || ("id_"+__name+"-"+(Math.floor(Math.random() * Date.now()) + 1)),true,false,true));
      
      /* base core filters usable in all components */
      Object.defineProperty(pre,'filters',setDescriptor(pre.filters || {},false,false,true));
      
      
      if(typeof pre.onFinish !== 'function') pre.onFinish = function(){};
      Object.defineProperty(pre,'onGlobalFinish',setDescriptor(pre.onFinish,true,false,true));
      
      /* add listen method */
      pre.listen = listen;
      Object.defineProperty(pre,'listen',setDescriptor(pre.listen,true,false,true));
      
      /* add unlisten method */
      pre.unlisten = unlisten;
      Object.defineProperty(pre,'unlisten',setDescriptor(pre.unlisten,true,false,true));
      
      /* add alert method */
      pre.alert = alert;
      Object.defineProperty(pre,'alert',setDescriptor(pre.alert,true,false,true));

      /* whether to attempt to store data in sessionStorage */
      Object.defineProperty(pre,'sessionStorage',setDescriptor((false),true,false,true));

      /* whether to attempt to store data in localStorage */
      Object.defineProperty(pre,'localStorage',setDescriptor((false),true,false,true));

      /* whether to attempt to store data in the model */
      Object.defineProperty(pre,'store',setDescriptor((false),true,false,true));

      /* if this component can have children components of the same type, to prevent recursion */
      Object.defineProperty(pre,'multiple',setDescriptor((false),true,false,true));
      
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
        
        /* if there are any prototypes on this component they are added to the Data sets prototype */
        for(var x=0,keys=Object.keys(component.prototype),len=keys.length;x<len;x++)
        {
          Object.defineProperty(obsv,[keys[x]],setDescriptor(component.prototype[keys[x]],true));
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
              case 'node':
                map.connect(vm).replaceNode();
              break;
              default:
                /* standard data connection and value set */
                map.connect(vm);
              break;
            }
          })
        });
        
        mappedAttrs.wrapper.kb_viewmodel.onFinish.call(mappedAttrs.wrapper.kb_viewmodel,mappedAttrs.wrapper);
        if(mappedAttrs.wrapper.kb_viewmodel.onGlobalFinish)
        {
          mappedAttrs.wrapper.kb_viewmodel.onGlobalFinish.call(mappedAttrs.wrapper.kb_viewmodel,mappedAttrs.wrapper);
        }
        if(mappedAttrs.wrapper.kb_viewmodel.onNodeFinish)
        {
          mappedAttrs.wrapper.kb_viewmodel.onNodeFinish.call(mappedAttrs.wrapper.kb_viewmodel,mappedAttrs.wrapper);
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

      function init(name,node)
      {
        /* Create node template and map the inner nodes of the template */
        __mappedAttrs = new _mapper(node,true);
        
        /* do a replace for simple initial replacements inside binds */
        __mappedAttrs.wrapper.innerHTML = __mappedAttrs.template;
        
        __mappedAttrs.wrapper.kb_mapper = __mappedAttrs.wrapper;
        
        /* define component tree for multiples later */
        Object.defineProperty(__mappedAttrs.wrapper,'__kbcomponenttree',setDescriptor(node.kb_mapper ? node.kb_mapper.__kbcomponenttree.slice() : []));
        
        /* replace original node with new templated node */
        node.parentElement.stopChange().replaceChild(__mappedAttrs.fragment,node);
        
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
          __mappedAttrs.wrapper.className += (" "+__mappedAttrs.wrapper.kb_viewmodel.id);
          __mappedAttrs.wrapper.className += (!!__mappedAttrs.wrapper.kb_viewmodel.loopid ? " "+__mappedAttrs.wrapper.kb_viewmodel.loopid : "");
          
          /* watch for changes to alert any scope messages */
          __mappedAttrs.wrapper.kb_viewmodel.subscribeDeep('*',scopesubscription).callAllSubscribers();
          __mappedAttrs.wrapper.kb_viewmodel.kbnode = __mappedAttrs.wrapper;
          
          /* stop any html updates */
          __mappedAttrs.wrapper.addChildAttrListener('html',function(e){
            if(!e.stopChange)
            {
              /* check if its a new component being appended or check if its a single bind */
              if(['appendChild','insertSibling','insertBefore','insertAfter'].indexOf(e.attr) !== -1 && (e.arguments[0] instanceof HTMLUnknownElement || e.arguments[0] instanceof HTMLScriptElement))
              {
                return true;
              }
              else if(['innerHTML','textContent'].indexOf(e.attr) !== -1 && e.target.__kbhtmllistener)
              {
                return true;
              }
              e.preventDefault();
              e.stopPropagation();
            }
          });
          __mappedAttrs.wrapper.addChildAttrUpdateListener('html',function(e){
            if(['appendChild','insertSibling','insertBefore','insertAfter'].indexOf(e.attr) !== -1 && e.arguments[0] instanceof HTMLUnknownElement)
            {
              Konnekt(e.arguments[0]);
            }
          });
          
          getInnerComponents(__mappedAttrs.wrapper);
        }
        else
        {
          console.error("Warning!! You are attempting to make a recursive component %o, recursive components can lead to memory stack overflows unless properly handled, Please check your components html for use of this component, if You want this to be a recursive component please set `this.multiple = true;`",name);
          console.error("Recursive Component %o on %o",__mappedAttrs.wrapper,__mappedAttrs.wrapper.parentElement);
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
    
    function scopesubscription(e)
    {
      var local = this.__kbref.local,
          id = this.__kbref.id,
          loopid = this.__kbref.loopid,
          key = this.__kbscopeString+(this.__kbscopeString.length !== 0 ? '.' : '')+e.key;
      if(_scopemessages[local])
      {
        if(_scopemessages[local][key])
        {
          for(var x=0,len=_scopemessages[local][key].length;x<len;x++)
          {
            _scopemessages[local][key][x](e);
          }
        }
      }
      if(_scopemessages[id])
      {
        if(_scopemessages[id][key])
        {
          for(var x=0,len=_scopemessages[id][key].length;x<len;x++)
          {
            _scopemessages[id][key][x](e);
          }
        }
      }
      if(_scopemessages[loopid])
      {
        if(_scopemessages[loopid][key])
        {
          for(var x=0,len=_scopemessages[loopid][key].length;x<len;x++)
          {
            _scopemessages[loopid][key][x](e);
          }
        }
      }
    }
    
    function buildNode(e)
    {
      var name = e.node.tagName.toLowerCase();
      if(!Konnekt.isRegistered(name) && !e.node.kb_isLoading)
      {
        e.node.kb_isLoading = true;
        Konnekt.loadWaitList(name,function(n,c){
          if(e.event === 'replaceNode')
          {
            Konnekt(e.node,[],{onNodeFinish:function(node){e.map.local = node;}});
          }
          else
          {
            Konnekt(e.node);
          }
        });
        if(!Konnekt.loadWaitList(name).loading) 
        {
          Konnekt.loadWaitList(name).loading = true;
          _Loader(name);
        }
      }
      else
      {
        if(Konnekt.isRegistered(name))
        {
          if(e.event === 'replaceNode')
          {
            Konnekt(e.node,[],{onNodeFinish:function(node){e.map.local = node;}});
          }
          else
          {
            Konnekt(e.node);
          }
        }
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
        else if(_mixed.prototype.isObject(obj[keys[x]]) && obj[keys[x]].pointer)
        {
          obj2.pointers[keys[x]] = {filters:obj[keys[x]].filters,key:obj[keys[x]].key,point:obj[keys[x]].pointer};
        }
        else
        {
          if(_mixed.prototype.isObject(obj[keys[x]]))
          {
            if(obj2[keys[x]] === undefined) obj2[keys[x]] = {};
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
      return obj2;
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
      
      if(_fetchedConfigs)
      {
        Konnekt.loadWaitList(name).forEach(function(onload){
          onload(name,component);
        });
        Konnekt.loadWaitList(name,'clear');
      }
      else
      {
        _onConfigsFetched.push(function(){
          Konnekt.loadWaitList(name).forEach(function(onload){
            onload(name,component);
          });
          Konnekt.loadWaitList(name,'clear');
          
        });
      }
    }
    
    function sub(e)
    {
      var listeners = _scopemessages[this.query][this.key];
      for(var x=0,len=listeners.length;x<len;x++)
      {
        listeners[x](e);
      }
    }
    
    function unlisten(query,key,func)
    {
      /* standard message listener */
      if(arguments.length === 2)
      {
        func = key.bind(this);
        key = query;
        if(_messages[key])
        {
          for(var x=0,len=_messages[key].length;x<len;x++)
          {
            if(_messages[key][x].toString() === func.toString())
            {
              _messages[key].splice(x,1);
            }
          }
        }
        else
        {
          console.error('no listeners exists by key %o',key);
        }
      }
      else
      {
        func = func.bind(this);
        if(_scopemessages[query] && _scopemessages[query][key])
        {
          for(var x=0,len=_scopemessages[query][key].length;x<len;x++)
          {
            if(_scopemessages[query][key].toString() === func.toString())
            {
              _scopemessages[query][key].splice(x,1);
            }
          }
        }
      }
      return this;
    }
    
    /* messaging commands */
    function listen(query,key,func)
    {
      /* standard message listener */
      if(arguments.length === 2)
      {
        func = key.bind(this);
        key = query;
        if(!_messages[key]) _messages[key] = [];
        _messages[key].push(func);
      }
      else
      {
        func = func.bind(this);
        if(!_scopemessages[query]) _scopemessages[query] = {};
        if(!_scopemessages[query][key]) _scopemessages[query][key] = [];
        _scopemessages[query][key].push(func);
        
        /* if this happens to be a parent component we immediately retrieve the value, if not then callAllSubscribers will fire initial */
        if(document.querySelector('.'+query))
        {
          var scopeMessages = _scopemessages[query][key],
              data = document.querySelector('.'+query).kb_mapper.kb_viewmodel,
              local = data.getLayer(key),
              localKey = key.split('.').pop(),
              val = local[localKey];
          scopeMessages[(scopeMessages.length-1)]({
            key:localKey,
            value:val,
            oldValue:val,
            local:local,
            kbref:data,
            onChange:false,
            initial:true
          });
        }
      }
      return this;
    }
    
    function alert(key,e)
    {
      if(_messages[key])
      {
        for(var x=0,len=_messages[key].length;x<len;x++)
        {
          _messages[key][x](e);
        }
      }
      return this;
    }
    
    /* environment detection */
    Konnekt.detectDevice = function()
    {
      var mobile = /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard|[^a-z]rim[^a-z]|sonyericsson|nokia|[^a-z]mib[^a-z])/,
          tablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
      
      if(navigator.userAgent.toLowerCase().match(mobile)) return 'mobile';
      
      if(navigator.userAgent.toLowerCase().match(tablet)) return 'tablet';
      
      return 'desktop';
    }
    
    Konnekt.detectBrowser = function()
    {
      // Opera 8.0+
      var isOpera = ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0);

      // Firefox 1.0+
      var isFirefox = (typeof InstallTrigger !== 'undefined');

      // Safari 3.0+ "[object HTMLElementConstructor]" 
      var isSafari = (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification));

      // Internet Explorer 6-11
      var isIE = /*@cc_on!@*/false || !!document.documentMode;

      // Edge 20+
      var isEdge = !isIE && !!window.StyleMedia;

      // Chrome 1+
      var isChrome = !!window.chrome && !!window.chrome.webstore;
      
      return isOpera ? 'opera' :
        isFirefox ? 'firefox' :
        isSafari ? 'safari' :
        isChrome ? 'chrome' :
        isIE ? 'ie' :
        isEdge ? 'edge' :
        "unknown";
    }
    
    Konnekt.detectOrientation = function()
    {
      if(screen.width > screen.height)
      {
        return 'landscape';
      }
      else if(screen.height > screen.width)
      {
        return 'portrait';
      }
      else
      {
        return 'square';
      }
    }
    
    Konnekt.detectScreenOrientation = function()
    {
      if(window.innerWidth > window.innerHeight)
      {
        return 'landscape-size';
      }
      else if(window.innerHeight > window.innerWidth)
      {
        return 'portrait-size';
      }
      else
      {
        return 'square-size';
      }
    }
    
    Konnekt.detectScreenSize = function()
    {
      if((this.detectOrientation() === 'landscape' ? window.innerWidth : window.innerHeight) < 1280)
      {
        if((this.detectOrientation() === 'landscape' ? window.innerWidth : window.innerHeight) < 750)
        {
          return 'mobile-size';
        }
        return 'tablet-size';
      }
      else
      {
        return 'desktop-size';
      }
    }
    
    Konnekt.config = function(v){
      function recSet(from,to)
      {
        for(var x=0,keys=Object.keys(from),len=keys.length;x<len;x++)
        {
          if(typeof from[keys[x]] === 'object')
          {
            if(to[keys[x]] === undefined) to[keys[x]] = {};
            recSet(from[keys[x]],to[keys[x]]);
          }
          else if(to[keys[x]] !== 'object')
          {
            to[keys[x]] = from[keys[x]];
          }
        }
      }
      recSet(v,_config);
      return Konnekt;
    };
    
    function detectKeyboard()
    {
      /* detect if the current window size is smaller than 60% of the original device size */
      return (window.innerHeight < screen.height-(screen.height*0.40));
    }
    
    function setBaseClasses()
    {
      if(!document.querySelector('meta[name="viewport"]'))
      {
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        document.head.stopChange().appendChild(meta);
      }
      
      if(!Konnekt.device) Konnekt.device = {};
      Konnekt.device.type = Konnekt.detectDevice();
      Konnekt.device.orientation = Konnekt.detectOrientation();
      Konnekt.device.browser = Konnekt.detectBrowser();
      Konnekt.device.screenSize = Konnekt.detectScreenSize();
      Konnekt.device.orientationSize = Konnekt.detectScreenOrientation();
      Konnekt.device.keyboard = (Konnekt.device.type !== 'desktop' ? (detectKeyboard()) : false);
      
      document.body.className = Konnekt.device.type
      +" "+Konnekt.device.orientation
      +(Konnekt.device.keyboard ? ' keyboard' : '')
      +" "+Konnekt.device.browser
      +" "+Konnekt.device.screenSize
      +" "+Konnekt.device.orientationSize;
    }
    
    window.addEventListener('resize',setBaseClasses);
    if(document.body)
    {
      setBaseClasses();
    }
    else
    {
      document.addEventListener("DOMContentLoaded",function(){
        setBaseClasses();
      })
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
      if(isRouting && _query.env !== 'dev')
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
            if(!_fetchedConfigs)
            {
              _onConfigsFetched.push(function(){
                _hashrouter(window.location.hash.replace('#',''));
              });
            }
            else
            {
              _hashrouter(window.location.hash.replace('#',''));
            }
          });
        }
        else
        {
          if(!_fetchedConfigs)
          {
            _onConfigsFetched.push(function(){
              _hashrouter(window.location.hash.replace('#',''));
            });
          }
          else
          {
            _hashrouter(window.location.hash.replace('#',''));
          }
        }
      }
      return this;
    }
    
    Konnekt.addHashRouter = function(func)
    {
      _hashrouter.addHashListener(func);
      return Konnekt;
    }
    
    Konnekt.removeHashRouter = function(func)
    {
      _hashrouter.removeHashListener(func);
      return Konnekt;
    }
    
    if(!_mixed.prototype._parse) _mixed.prototype._parse = _mixed.prototype.parse;
    _mixed.prototype.parse = function()
    {
      if(this.__kbref.kbnode)
      {
        var maps = this.__kbref.kbnode.kb_mapper.kb_maps,
            parsed = this._parse.apply(this,arguments);
        
        this.unsubscribeDeep('*',scopesubscription);
        this.subscribeDeep('*',scopesubscription).callAllSubscribers();
        
        Object.keys(maps).forEach(function(key){
          maps[key].forEach(function(map){
            map.reset();
          });
        });
      }
      else
      {
        return this._parse.apply(this,arguments);
      }
    }
    
    /* bring in Konnekt config */
    function createScript(url,cb)
    {
      var sc = document.createElement('script');
      sc.src = url;
      sc.onerror = function()
      {
        cb(null,true);
      }
      sc.onload = function()
      {
        cb(_config);
      }
      document.head.stopChange().appendChild(sc);
    }
    
    function checkNode_config(cb)
    {
      createScript((_config.prefix !== undefined ? _config.prefix : '')+'/node_modules/konnekt/config/config.js',cb);
    }
    
    function checkBower_config(cb)
    {
      createScript((_config.prefix !== undefined ? _config.prefix : '')+'/bower_components/konnekt/config/config.js',cb);
    }
    
    function checkLocal_config(cb)
    {
      createScript((_config.prefix !== undefined ? _config.prefix : '')+'/config/config.js',cb);
    }
    
    function callWaitConfigMethods()
    {
      for(var x=0,len=_onConfigsFetched.length;x<len;x++)
      {
        _onConfigsFetched[x]();
      }
    }
    
    (function(){
      checkNode_config(function(config,err){
        if(err)
        {
          checkBower_config(function(config,err){
            if(err) console.error("the Konnekt local config was not found, this issue happens when You do not have Konnekt isntalled via th standard node_modules or bower_components module directories");
            checkLocal_config(function(cofig,err){
              
              /* this is the finish of the chain */
              _fetchedConfigs = true;
              callWaitConfigMethods();
            });
          });
        }
        else
        {
          checkLocal_config(function(cofig,err){
            
            /* this is the finish of the chain */
            _fetchedConfigs = true;
            callWaitConfigMethods();
          });
        }
      })
    }())
    
    window.Konnekt = Konnekt;
    return Konnekt;
  }
  return CreateKonnekt;
});

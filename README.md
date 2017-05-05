# Konnekt
> Multi layer component based binding framework

[![NPM version][npm-image]][npm-url]
[![Gitter][gitter-image]][gitter-url]

## Table of Contents

- [What is it?](#what-is-it)
- [Why you should use it?](#why-i-should-use-it)
- [Installation](#installation)
- [Usage](#usage)
  - [Getting started](#getting-started)
  - [File structure](#file-structure)
  - [Components](#components)
  - [Basics](#basics)
  - [Gulp tools](#gulp-tools)
  - [Bindings](#bindings)
    - [Standard Bind](#standard-bind)
    - [Built in binds](#built-in-binds)
    - [Filters](#filters)
      - [Built in filters](#built-infilters)
    - [Events](#events)
    - [Passing](#passing)
    - [Loops](#loops)
    - [Elements](#elements)
    - [Logic](#logic)
  - [Viewmodel](#viewmodel)
    - [Built in Properties](#built-in-proprties)
    - [Listeners](#listeners)
  - [Built Ins](#built-ins)
    - [Device Detection](#device-detection)
    - [Routing](#routing)
      - [File Routing](#file-routing)
      - [Hash Routing](#file-routing)
    - [Environments](#environments)
- [Configs](#configs)
- [Examples](#examples)
- [Development](#development)
- [Changelog](#changelog)
- [How to contribute](#how-to-contribute)
- [License](#license)


## What is it?
This is a framework that allows you to comprise an app based on modular components in an atom based approach using a simple(HTML, CSS, JS) component folder architecture.
Each file is comprised in the given way:

- HTML (the html for just that component)
- CSS (the css just for that component)
- JS (the data, methods, and events associated with that component)

Each component is comprised in a way to allow for easy and friendly development by using an MVVM modular binding approach so components can be plug and play and independent of everything else. This allows easy reusability through out the entire app.

## Why you should use it?

- **Simple** Provides many built in functionality that allows you to create an app quickly and efficiently
- **Modular** By splitting up the app into components You can reuse them across the app, which saves you development time
- **Designer Friendly** This framework has been created with designers in mind to allow easy and friendly development
- **Two Way Binding** One of the few frameworks to have true two way bindings with the dom

## Installation

This libray can be installed directly using [NPM](https://www.npmjs.com) or [Bower](https://bower.io/)

- First step:

  - `npm i konnekt --save`

All cli commands come packaged along with konnekt.

## Usage
These chapters are meant to be useful in learning more about how to work with the different powerful functionalities that konnekt provides

### Getting started
Creating a component is as simple as using the built in `gulp create` command

- First step: (using cmd prompt)

  - `gulp create`
  - Follow in console prompts eg. (name, description, contributor)
  
Using the konnekt library in your project is as simple as initiating it

```js
<script src="/node_modules/konnekt/min/konnekt.min.js" type="text/javascript"></script>
<script>
  var konnektjs = Konnekt();
</script>
```
 
There are two ways to get started using your components

- First choice (using built in hashrouting)

This automatically replaces `\<body>` content with your desired component

```js
var konnektjs = Konnekt({
  base:'Name-Of-The-Component-You-Want-To-Load-Into-Body',
  prefix:'prefix-for-url-if-using-local-routing'
});
konnektjs.hashRouting(true);
```
  
- Second choice (using konnekt built in parser)

The element will be replaced with your desired component, this can be used multiple times

```js
<body>
  <mycomponent></mycomponent>
  <script>
    konnektjs(document.querySelector(mycomponent));
  </script>
</body>
``` 

**Now Go Make Your App!**

### File structure
The file structure of a konnekt app can be comprised of a single html entry point, your pre-installed libraries and a components folder to house all your components. Each component houses three main files, a **HTML**,**CSS**, and **JS** file, the build folder houses compiled files of your component to be loaded using different environments in a production scenario.

```
├── components/
│   ├── component/
│   │   ├── build/
│   │   │   ├── qa
│   │   │   │   ├── component.js
│   │   │   │   ├── component.min.js
│   │   │   ├── stage
│   │   │   ├── prod
│   │   ├── component.html
│   │   ├── component.css
│   │   ├── component.js
├── node_modules/
│   │   ├── konnekt
├── index.html
```

### Components

Components are a single html tag that is then replaced by its corresponding template, css, and code associated with it.

By simply refrencing in your html:
```html
  <foo></foo>
```

this will build out to your componnt such as:
```html
  <div>
    <h1>Foo</h1>
    <div>
      <p>some text about foo</p>
    </div>
  </div>
```

Components can also be comprised of other components which gets into the atom based approach of starting off with small component parts and building up to larger ones. Such as:

```html
  <bar></bar>
```

equals

```html
  <div>
    <foo></foo>
    <foo></foo>
  </div>
```

Each component builds out to its corresponding component set.

### Basics
All files of a component can be connected using binds, the basic bind syntax uses {{}} Bracket notation,
bindings house extra functionality called filters represented after the | symbol in a bind.
filters allow changing of a value/syntax prior to being placed on the page.

##### HTML

```html
<div class="mycomponent" onclick="{{clickaction}}" attr="{{attrbinding}}">
  <div class="innerdiv">{{textbinding | toUpperCase}}</div>
</div>
```

##### CSS

```css
  .{{localidbinding}} .mycomponent {
    background:{{backgroundstylebinding}}px
  }
  .innerdiv {
    color:{{colorstylebinding}}
  }
```

##### JS

```js
 function mycomponent(element)
 {
    /* closure */
    var self = this;
    
    /* Your properties */
    this.attrbinding = "test";
    this.textbinding = "mytext";
    this.backgroundstylebinding = "#000";
    this.colorstylebinding = "#FFF";
    
    /* your filter for changing text before it appends to your element */
    this.filters.toUpperCase = function(v)
    {
      return v.toUpperCase();
    }
    
    /* your event bind */
    this.clickaction = function(e)
    {
      self.someaction();
    }
 }
 
 /* any extra methods on your prototype */
 mycomponent.prototype.someaction = function()
 {
    this.colorstylebinding = "#F00";
 }
```

### Gulp tools

There are 3 main tools for working with konnekt components the built in cli commands.

Each command has built in prompts in cmd that are easy to follow, You can also use shorthand to skip the prompts

1. Create Tool `gulp create` (used fo rcreating components)
2. Build Tool `gulp build` (used for building components to different environments)
3. Local Server `gulp server` (used for easy local environment testing)

Shorthand example: `gulp server --port=8080 --root=(folderpath or . for local directory)`

### Bindings

Bindings in components can almost be placed anywhere, Any text in your css file can be binded, and any attribute and inner text in the html can be binded.

There are some pre built in methods that add great functionality to binds to go over.

#### Standard Bind

A standard bind is comprised of a {{}} notation with a name refrencing a data point in your js file, The js file we will call the viewmodel of your component. The following example is a standard binding:

- Text Binding
```html
  <div>{{mytext}}</div>
```

- Attr Binding
```html
  <div class="{{myclassname}}"
```

- CSS Binding
```css
  .class {
    background:#{{mybackgroundcolor}}
  }
```

These bindings can also be in line with another and sets of text

```html
  <div>Hello, my name is {{firstname}} {{lastname}}</div>
```

Binds attach to thier corresponding data set in the js code, such as the following example:

- HTML
```html
  <div>Hello, my name is {{firstname}} {{lastname}}</div>
```

- JS
```js
  function user()
  {
    this.firstname = "Foo";
    this.lastname = "Bar";
  }
```

Bind keys can also be bound to properties further down in a chain by using the `.` syntax, example:

- HTML
```html
  <div>The {{animals.0.name}} likes to {{animals.0.sound}}</div>
  <div>he {{animals.1.name}} likes to {{animals.1.sound}}</div>
```

- JS
```js
  function species()
  {
    this.animals = [
      {name:'cat',sound:'meow'},
      {name:'dog',sound'bark'}
    ];
  }
```
<div id="pollution" style="display:none;"></div>
A special note on binds, if a the bind does not have any other text or binds asociated it acts as a **two-way** bind, if the attr or text changes for that bind it will update the viewmodel data to reflect that change.

Example:

HTML
```html
  <div class="foo">{{foobind}}</div>
```

JS
```js
  function foo(node)
  {
    var self = this;
    this.foobind = "bar";
    
    node.querySelector('.foo').onclick = function()
    {
      this.innerHTML = "something else";
      console.log(self.foobind);
    }
  }
```

this changes the html of the foo div to `something else` and in doing so the bind property of `foobind` will console log the same, this will not work when the bind is polluted, an example of bind pollution is:

```html
  <div class="foo">some extra text {{foobind}}</div>
```

in this case You will be unable to change the html via your click event because your bind is polluted by other text.

Another scenario is passing binds to another component, these act as pointers to the original data.

Example:

HTML
```html
  <div>
    <bar onbarclick="{{onFooClick}}"></bar>
  </div>
```

JS
```js
  function foo()
  {
    var self = this;
    
    this.foobar = 'test';
    
    this.onFooClick = function(e)
    {
      console.log(self.foobar);
    }
  }
```

if the original onFooClick is changed this change will be reflected inside bar as well, same goes for changing it in bar as well.

#### Built in Binds

There are some built in binds that can be used throughout any component automatically, such examples are:

- **innerHTML** A bind that inserts nodes passed

FOO Component HTML
```html
  <div>
    <div>{{innerHTML}}</div>
  </div>
```

HTML *before*
```html
  <div>
    <foo>
      <div>bar</div>
    </foo>
  </div>
```

HTML *after*
```html
  <div>
    <div class="Wrapper Wrapper__Foo">
      <div>
        <div><div>bar</div></div>
      </div>
    </div>
  </div>
```

- **local** a unique identifier for that placed component

Class styles are shared among all components of type foo, so if a style changed for one component, then all will change, `local` allows you to set a css rule as an individual instance to that component and not be shared to others

FOO CSS
```css
  .{{local}} .fooclass {
    background:#{{foocolor}}
  }
```

HTML *before*
```html
  <div>
    <foo></foo>
  </div>
```

HTML *after*
```html
  <div>
    <div class="Wrapper Wrapper__foo foo_17364393747">
      <div class="fooclass">
        <div<bar</div>
      </div>
    </div>
  </div>
```

#### Filters

Filters help change the way data looks before it is put into the html or data, filters are assigned to a bind after the `|` char by name.

All binds can contain multiple filters by simply seperating them out using: `,` character like in a list

Example: `{{bindname | foofilter,barfilter,(foovmfilter),[+storefilter]}}`

**Pre built in filters (Coming Soon)**

There are currently four types of filters:

1. Standard dom filter syntax: 

`{{bindname | foofilter}}`

These filters are tied to Your vm on the `this.filters` object, these are methods that take in the value that is attempting to be set to the html and they must return the new value to be set after your done with it.

```js
function foo()
{
  this.filters = function foofilter(v)
  {
    return v.toLowerCase();
  }
}
```

**Note** filters that are attached to binds on a component will also be passed to the child component for you.

2. Data based filter in the case of non polluted binds: *p.s. notice the '()' around the filter name*

`{{bindname | (foovmfilter)}}`

These filters are placed in the same `this.filters` object but will only apply to changes coming from the html to the data direction of a non polluted binding, see: [Two-way binds](#pollution)

```js
function foo()
{
  this.filters = function foovmfilter(v)
  {
    return v.toUppercase();
  }
}
```

3. Storage filters

Storage filters are designed to store points of data so it is remembered later, these use three types of syntax for 3 types of storage:

- **Model** `{{bindname | [~store.foo]}}` stores in the model for use among other components when pages changes

- **Session** `{{bindname | [-store.foo]}}` stores in session so in case the page gets refreshed or user navigates way then back it is remembered

- **Local** `{{bindname | [+store.foo]}}` stores in local so that even when the browser is closed and reopened the value is remembered

Each of these three filters use the named string as their storage point, so keep this in mind when naming them.

**note**

inside filter methods `this` refers the vm data :)

##### Built in filters

- **toUpperCase** Capitalize all letters
- **toLowerCase** lowercase all letters, no caps
- **toFirstUpperCase** Capitalize first letter only
- **toEveryUpperCase** Capitalize first letter of every word
- **isHidden** returns `hide` or `block` based on true for `display` styles
- **isNotHidden** Opposite logic for `isHidden` same functionality

#### Events

Events can also be used as binds inside a component, to use an event bind You must bind the method to the appropriate attribute.

*A side note, the attribute in this case is not actually used as this is bad practice, Your binded method will be moved to the appropriate property on the element.*

Example of an event bind:

HTML
```html
  <div>
    <div onclick="{{fooclick}}">{{status}}</div>
  </div>
```

JS
```js
function foo()
{
  var self = this;
  this.status = "none";
  this.fooclick = function()
  {
    self.status = "clicked";
  }
}
```

**note**

your event `this` like all events will refer to the element, if You want to interact with your vm data You must create a closure, in this case it is the example of `var self = this`

#### Passing

Passing values from a parent component to another is very easy in just setting the attributes on the base component element, as an example we have the element `foo` as so:

HTML
```html
  <div onclick="{{fooclick}}">{{status}}</div>
```

JS
```js
  function foo()
  {
    this.status = "";
    this.fooclick = function(){};
  }
```

at this stage `status` and `onclick` are empty with nothing, to use these in a proper way we can pass to them from another component `bar`, current bind values can also be passed, but they do not act as binds and will not update the lower components if thiers is updated.
HTML
```html
  <div>
    <foo status="none" fooclick="{{barclick}}"></foo>
  </div>
```

JS
```js
  function bar()
  {
    this.barclick = function()
    {
      alert("hello from foo");
    }
  }
```

#### Loops

Loop bindings allow iterating through data and creating a component for each iteration as in a list.

The format is: `{{for key loop componentname}}` for each item in the key property loop create the component, each data set is passed to the component.

The component:

HTML (before)
```html
  <div>
    <ul>{{for animals loop listitem}}</ul>
  </div>
```

JS
```js
  function foo()
  {
    this.animals = [
      {type:'cat',sound:'meow'},
      {type:'dog',sound:'ruff'}
    ];
  }
```

Listitem component:

HTML
```html
  <li>The {{type}} likes to {{sound}}</li>
```

JS
```js
  function listitem()
  {
    this.type = "";
    this.sound = "";
  }
```

End result:

HTML (after)
```html
  <div>
    <ul>
      <div class="Wrapper Wrapper_listitem">
        <li>The cat likes to meow</li>
      </div>
      <div class="Wrapper Wrapper_listitem">
        <li>The dog likes to ruff</li>
      </div>
    </ul>
  </div>
```

One of the great things about looped items is that the data acts as a pointer between the parent array list and the child data points, by changing `this.type` the reflected change is shown in the list. The sme applies for array changes, by simplying `array.sort`ing a list the order of Your elements will change.

#### Elements

You also have the ability to bind to element tag names as well, featuring the ability to hot swap out components based on a binding

Example

HTML
```html
  <div>
    <{{foocomponent}}>
  </div>
```

JS
```js
  function foo()
  {
    this.foocomponent = 'name of the component';
  }
```

this is a simple version that allows you to place a component by the name specified by `foocomponent` property, if `foocomponent` property is updated with a new value it will attempt to fetch that component and swap out the current component with the new one.

filters and inner elements as well as other binds can also be placed on these hot swappable components as well, beware though that these binds and inner elements will be applied to any component that is ever swapped in as well.

Example:

HTML
```html
  <div>
    <{{foocomponent | isAllowed}} bar="{{fooname}}">
      <div>inner text></div>
    </{{foocomponent | isAllowed}}>
  </div>
```

JS
```js
  function foo()
  {
    this.foocomponent = 'bar';
    this.fooname = 'foobar';
  }
```

this will pass the property and value of `this.bar = 'foobar';` into any component that is swapped, as well as `<div>inner text</div>` will be the values placed to any bindings of `{{innerHTML}}`.

**note** Please note that the ending 

#### Logic

There are also some built in logic operators with binds that automatically populate as filters to a bind, these include:

- **Boolean Operators**
 - `==`
 - `>=`
 - `<=`
 - `>`
 - `<`

- **Arithmatic Operators**
  - `+`
  - `-`
  - `*`
  - `/`
  
These act in inline syntax to the key in the bind, Example:

```html
  <div>{{foo+" new text"}}</div>
  <div>{{foo*200}}</div>
  <div>{{foo==true}}</div>
```

###### Inline value set

Besides logic operators there are also built in sets for binds as well, to set the default of a key inline You can specify the value with a single `=`

```html
  <div>{{foo="bar"}}</div>
```

###### Single instance get/set

adding to the beginnig of a bind key either `<` or `>` specifies a single instanced get/set.

These get set or fetched once and are then erased from the html and never used again, these are used for setting data in either direction in a templating fashion

- `<` means a single get and must include a `=` set value along with the key
- `>` means a single set

Examples:

```html
  <div>{{>foo}}</div>
  <div>{{<foo="bar"}}</div>
```

### Viewmodel

Viewmodel is th heart of a components connection from html to logic, it specifies the values and actions connected to the html and styling of a component instance.

A standard Component Viewmodel:

```js
function foo()
{
  /* Your bindable properties get added here */
  this.prop = "foo";
  
  this.data = [];
  
  /* Filters also get added here onto the filters object */
  this.filters.toUpperCase = function(v)
  {
    return v.toUpperCase();
  }
  
  /* Event binds are also added to this section */
  this.fooclick = function(e)
  {
    alert("clicked");
  }
}

/* You can add extra interactive methods via prototypes */
foo.prototypes.ajaxCall = function()
{
  var self = this;
  ajaxcall().then(function(data){
    this.set('data',data);
  });
}
```

**NOTE**

A key importance to remember when working with the vm data is if You plan to support older browsers such as IE10,IE11 You must add data using `this.add` or `this.set` new data is not automatically seen on these browsers due to lack of support for [Proxies](http://caniuse.com/#feat=proxy).

Many of the extra features for working with the viewmodel data can be found here [KonnektDT](https://github.com/keleko34/konnektdt)

#### Built in Properties

There are a few built in properties that have extra uses when dealing with Your components and data

- **multiple(Boolean)** The multiple property allows you to use a component recursively

- **onFinish(function)** the onFinish is a property you can set a method to for when the component has finished building and being mapped

- **model(boolean)** the model property tells whether to store this entire vm in the model data set for use on other pages, this stores by `id` on the vm

(WIP cant save functions, only data)
- **sessionStorage(boolean)** This property tells to attempt to store the entire vm in session storage, though only data is stored and not any methods.

(WIP cant save functions, only data)
- **localStorage(boolean)** Similiar to sessionStorage but persists even when the browser is closed and reopened.

- **parse(Function)(@Params json(string))** Allows You to parse a json string directly to the vm data model

- **listen(Function)(@Params localid|id|loopid(string), key(string), callback(function))** Allows listeneing to a key on a specific component based with an id

- **listen(Function)(@Params key(string), callback(Function))** Allows listeneing to a key, requires another component calling `alert` method with desired key

- **alert(Function)(@Params key(string), value(Any))** Allows firing all listeners attached to that key

- **filters(Object)** Where all filter methods are attached including pre defined ones

Examples:

- **parse**

```js
  function foo()
  {
    var self = this;
    /* on click fetch your data */
    this.onclick = function()
    {
      self.getdata();
    }
  }
  
  foo.prototype.getdata = function()
  {
    var self = this;
    /* fetch your data somehow */
    ajaxrequest(function(jsondata){
      self.parse(jsondata);
    });
  }
```

#### Listeners

Listeners are great add ons that allow You to listen for alerts or changes of data in other components in the page.

- **listen @Params((id|local|loopid),key,function) or @Params(key,function)** 

This method allows listening for key alerts or for listening to specific components data changes

Example:

Foo
```html
  <div>
    <bar id="foobar"></bar>
  </div>
```

```js
  function foo()
  {
    /* key alerts */
    this.listen('key',function(e){
      /* fires when another component alerts with this key */
    });
    
    /* specific component data */
    this.listen('foobar','key',function(e){
      /* fires when this components data with the property 'key' changes */
    })
  }
```

- **unlisten @Params((id|local|loopid),key,function) or @Params(key,function)** 

This method removes listeners that were attached, **note: just like events you must pass in the original method that was used with the listener for removal**

```js
  function foo()
  {
    function listenToKey(e)
    {
    
    }
  
    /* Example of key version */
    this.listen('key',listenToKey);
    this.unlisten('key',listenToKey);
    
    /* Example of component id version */
    this.listen('foobar','key',listenToKey);
    this.unlisten('foobar','key',listenToKey);
  }
```

- **alert @Params(key,value)** 

This method allows You to alert any listening components of that key and pass them a value

```js
  function foo()
  {
    var self = this;
    /* an example using a click event */
    this.onclick = function()
    {
      /* Alert with a value */
      self.alert('key',500);
    }
  }
```

The passed objects into the listen methods that are passed are represented in two forms,

- **listen(key,function)** only a value is passed

- **listen((id|local|loopid),key,function)** The following object is pass:

  - key: The key that changed
  - value: the current value set
  - oldValue: the old value that was set
  - stopChange: whether a stopChange was applied on this value change or not
  - local: the local based object layer
  - kbref: the base object of the entire data set
  - initial: Whether this is an initial data fetch
  
**note: when add a listen that connects to a component, that listen will be fired immediately containing the current value that is set, You can filter these out by reading the event.initial property that is passed when your function is fired**

## Built Ins

Built ins are extra functionality that can be used inside of components that are not necessariliy part of html or vm functionality

### Device Detection

You can use some simple properties and css classes to help with device detection in your styling or code

Type of device being used:

- Device
  - mobile
  - tablet
  - desktop
  
Orientation of the device:

- Orientation
  - portrait
  - landscape
  
Type of browser being used:

- Browser
  - ie
  - chrome
  - firefox
  - safari
  - unknown
  
if not a desktop, if the keyboard is open:

- Keyboard
  - true/false

The actual window size of the current app, can differ when user resizes window say on a desktop:

- ScreenSize
  - mobile-size
  - tablet-size
  - desktop-size
  
The actual window orientation of the current app, can differ when user resizes window say on a desktop:

- OrientationSize
  - portrait-size
  - landscape-size
  
  
CSS:
```css
  .desktop .foo {
    width:60px;
  }
  .mobile .foo {
    width:20px;
  }
  
  .keyboard .foo {
    width:100%;
  }
```

The JS based version can be retrieved off the base `Konnekt` method like via the `device` property:

JS:
```js
  var device = Konnekt.device.type; //"mobile"
  var isKeyboard = Konnekt.device.keyboard; //true/false
  var screenSize = Konnekt.device.screenSize; //"mobile-size"
```

### Routing

#### File Routing

Component routing is handled in two ways:

- backend Nodejs based routing, allows `dev` environment
- frontend based routing, does not allow `dev` environment

To turn on front end routing You must use the `localRouting(true)` method from Konnekt

Example:

JS
```js
  var konnektjs = Konnekt()
  .localRouting(true);
```

**note** local routing is unable to provide the `dev` environment cause it requires concatinating files on the backend which is not possible in the front end, use `qa` env for debugging and building.

Backend routing uses the `konnektrt` module that can be installed via `npm install konnektrt --save`

then inside your nodejs router you can require it, it accepts, `res,req,next`

Example:

JS
```js
  var konnektrt = require('konnektrt');

  module.exports = {
    Routes:[
  
      /* just call it wherever You want the method to be placed as a route, it accepts 3 params, res,req,next */
      konnektrt(),

      //other routes...
    ]};
```

#### Hash Routing

Konnekt also comes packed also with a hash router but by default this is turned off, a hash router means it routes components based on any `#hash` in the url bar

Example: `http://yourwebsite.com/#componentname`

to enable hash routing just simply call the `hashRouting` method on the main konnekt object

JS
```js
  var konnektjs = Konnekt().hashRouting(true);
```

Hash routing requires a `base` to be specified in the config, this can either be in your local config, passed to the library constructor

Base component for base `/` url

Your config
```js
  Konnekt.config({
    base:'foo'
  });
```

In constructor
```js
  var konnektjs = Konnekt({
    base:'foo'
  })
  .hashRouting(true);
```

**setting up custom routes:**

setting up custom routes is easy as simply listening for a hash change on konnekt

Example:

JS
```js
  var konnektjs = Konnekt({
    base:'foo'
  })
  .hashRouting(true)
  .addHashRouter(function(e){
    /* control hash or prevent default here */
    e.preventDefault();
  });
```

The event object for the hashrouter contains the following properties:

- **preventDefault(Function)** this prevents the base swapper that repalces body tag content with the component refrenced by the hash
- **stopPropogation(Function)** this prevents any future added routes from firing
- **hash(String)** this is the hash name that was entered
- **url(String)** this is the current full url that is being used in the url header

### Environments

Konnekt alsow comes with built in environment levels, for proper production deployment. by default the prod environment is always loaded, this is what the end user will see

to access different environments You must pass queries in the url.

- **env**
  - **dev** the base development environment, **note** doesnt work when using `localRouting`
  - **qa** the unit testing environment
  - **stage** the staged user testing environment
  - **prod** the end product
  
The debug option allows loading non minified versions of your components for easier debugging
  
- **debug**
  - **true**
  - **false**
  
Example urls:

`http://yoursite.com/?env=dev&debug=true`

## Configs

You can set config data that is shared among all components inside your `configs/config.js` file, some examples of things You can set:

- **filters(Object)** You can set default filters for every component
- **base(String)** You can set the name of the base component that is loaded for default homepage
- **prefix(String)** a prefix to place in front of all url requests
- **onFinish(Function)(@Params callback(function))** You can set a onFinish for all components

## Examples

You can view an example implementation of an app using all the different types of functionality from these apps:

- [Todo App](https://github.com/keleko34/konnekt_todo_app_example)

###### Adding Device detection throughout the app from the base component

Init
```js
  var konnektjs = Konnekt({
    base:'base'
  })
  .hasRouting(true);
```

Base
```js
  function base()
  {
    var self = this;
    
    /* add a resize listener to send out alerts for media device changes */
    window.addEventListener('resize',function(){
      self.alert('app_width',window.innerWidth);
      self.alert('app_height',window.innerHeight);
      self.alert('app_device',konnektjs.device.type);
      self.alert('app_orientation',konnektjs.device.orientation);
      self.alert('app_browser',konnektjs.device.browser);
      self.alert('app_keyboard',konnektjs.device.keyboard);
    });
  }
```

Another component
```js
  function anothercomponent()
  {
    /* use initial value */
    this.showKeyboardInput = konnektjs.device.keyboard;
    
    /* listen for future updates */
    this.listen('app_keyboard',function(value){
      this.showKeyboardInput = value;
    });
  }
```


## Development

If You would like to keep track of what is currently being developped on this framework, You can look at our [Trello](https://trello.com/b/X55aqPpM/konnektjs)

## Changelog

The changelog can be viewed here: [Changelog](https://github.com/keleko34/Konnekt/blob/master/History.md)

## How to contribute

If You would like to contributem here are the steps

1. Clone Repo: [Konnekt Github Repo](https://github.com/keleko34/konnekt)

2. Install dependencies and necessary git repos: `npm run installer`

3. To build the dependencies: `gulp build` require_lib option

4. to test: `gulp server -p 8080 -r test`

5. Make a request for your changes :)


## License

You can view the license here: [License](https://github.com/keleko34/Konnekt/blob/master/LICENSE)

[npm-url]: https://www.npmjs.com/package/konnekt
[npm-image]: https://img.shields.io/npm/v/konnekt.svg
[gitter-url]: https://gitter.im/konnektjs/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[gitter-image]: https://badges.gitter.im/konnektjs/Lobby.svg
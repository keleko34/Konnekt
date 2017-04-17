# Konnekt
> Multi layer component based binding framework

[![NPM version][npm-image]][npm-url]

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
    - [Events](#events)
    - [Passing](#passing)
    - [Loops](#loops)
  - [Viewmodel](#viewmodel)
    - [Built in Properties](#built-in-proprties)
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

Each component is comprised in a way to allow for easy and friendly development by using an MVVM modular binding approach so components can be plug and play independent of everything else. This allows easy reusability throught the entire app.

## Why you should use it?

- **Simple** Provides many built in functionality that allows youto create an app quickly and efficiently
- **Modular** By splitting up the app into components You can reuse them across the app and which saves you development time
- **Designer Friendly** This framework has been created with designers in mind to allow easy and friendly development
- **Two Way Binding** One of the few frameworks to have true two way binding with the dom

## Installation

This libray can be installed directly using [NPM](https://www.npmjs.com) or [Bower](https://bower.io/)

- First step:

  - `npm i konnekt --save`

It is highly suggested to use the bundable [K_Tasks](https://www.npmjs.com/package/K_Tasks) library as well as this will simplify the development process using gulp automated tasks

- Second step:

  - `npm i K_Tasks --save-dev`

## Usage
These chapters are meant to be useful in learning more about how to work with the different powerful functionalities that konnekt provides

### Getting started
Creating a component is as simple as using the K_Tasks built in `create` command

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

This automatically replaces \<body> content with your desired component

```js
var config={base:'NameOfTheComponentYouWantToLoadIntoBody'}
konnektjs.hashRouting(true);
```
  
- Second choice (using konnekt built in parser)

The element will be replaced with your desired component, this can be used as much as you want

```js
<body>
  <mycomponent></mycomponent>
  <script>
    konnektjs(document.querySelector(mycomponent));
  </script>
</body>
``` 

**Now go make Your App!**

### File structure
The file structure of a konnekt app can be comprised of a single html entry point, your pre-installed libraries and a components folder to house all your components. Each component houses three main files, an **HTML**,**CSS**, and **JS** file, the build folder houses compiled files of your component to be loaded using different environments in a production scenario.

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
│   │   ├── K_Tasks
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

There are 3 main tools for working with konnekt components when using the [K_Tasks](https://github.com/keleko34/k_tasks) module.

Each command has built in prompts in cmd that are easy to follow, You can also use shorthand to skip the prompts

1. Create Tool `gulp create` (select component option)
2. Build Tool `gulp build` (select component option)
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


HTML

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

- **sessionStorage(boolean)** This property tells to attempt to store the entire vm in session storage, though only data is stored and not any methods.

- **localStorage(boolean)** Similiar to sessionStorage but persists even when the browser is closed and reopened.


## Examples

You can view an example implementation of an app using all the different types of functionality from these apps:

- [Todo App](https://github.com/keleko34/konnekt_todo_app_example)

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
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
  - [Filters](#filters)
  - [Events](#events)
  - [Viewmodel](#viewmodel)
- [Examples](#examples)
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

###### Standard Bind

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

###### Built in Binds

There are some built in binds that can be used throughout any component automatically, such examples are:

- **innerHTML** A bind that inserts nodes passed


[npm-url]: https://www.npmjs.com/package/konnekt
[npm-image]: https://img.shields.io/npm/v/konnekt.svg
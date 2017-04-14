if(!K_Components) K_Components = {};
K_Components["todobutton"] = (function(){
/*********************************
 *  todobutton
 *  Created by keleko34
 *  a button for todo items
 ********************************/

function todobutton()
{
  /* ATTRIBUTES */
  this.isActive = false;
  this.title = "";
  this.filters.activeText = function(v)
  {
    return (v ? 'active' : 'inactive');
  }
  this.onclick = function(){};
}

/* PROTOTYPES */

todobutton.prototype.k_html = "<!-- todobutton Created by keleko34, a button for todo items --><div title='{{title}}' class='todobutton todobutton--{{isActive | activeText}}' onclick='{{onclick}}'>  <div class='todobutton__content'>{{innerHTML}}</div></div>";
todobutton.prototype.k_css = "/********************************* *  todobutton *  Created by keleko34 *  a button for todo items ********************************/.todobutton {  cursor:pointer;}";
return todobutton;
}());
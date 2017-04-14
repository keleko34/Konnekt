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
  
  /* tells if the button is toggled or not */
  this.isActive = false;
  
  /* the main title of this button */
  this.title = "";
  
  /* filter toggle for class based on this.active */
  this.filters.activeText = function(v)
  {
    return (v ? 'active' : 'inactive');
  }
  
  /* the passed onclick event */
  this.onclick = function(){};
}

/* PROTOTYPES */

todobutton.prototype.k_html = "<!-- todobutton Created by keleko34, a button for todo items --><div title='{{title}}' class='todobutton todobutton--{{isActive | activeText}}' onclick='{{onclick}}'>  <div class='todobutton__content'>{{innerHTML}}</div></div>";
todobutton.prototype.k_css = "/********************************* *  todobutton *  Created by keleko34 *  a button for todo items ********************************/.todobutton {  cursor:pointer;}";
return todobutton;
}());
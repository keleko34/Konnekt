if(!K_Components) K_Components = {};
K_Components["navitem"] = (function(){
/*********************************
 *  navitem
 *  Created by keleko34
 *  a single clickable navitem for the navbar
 ********************************/

function navitem()
{
  var self = this;

  this.link = "";

  /* ATTRIBUTES */
  this.onclick = function()
  {
    /* This is where we use listener to push to changes: container link */
  }
}

/* PROTOTYPES */

navitem.prototype.k_html = "<!-- navitem Created by keleko34, a single clickable navitem for the navbar --><div class='navitem' onclick='{{onclick}}'>  <div>{{innerHTML}}</div></div>";
navitem.prototype.k_css = "/********************************* *  navitem *  Created by keleko34 *  a single clickable navitem for the navbar ********************************/.navitem {}";
return navitem;
}());

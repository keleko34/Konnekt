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
  this.left = 0;

  /* ATTRIBUTES */
  this.onclick = function()
  {
    /* This is where we use listener to push to changes: container link */
  }
}

/* PROTOTYPES */

navitem.prototype.k_html = "<!-- navitem Created by keleko34, a single clickable navitem for the navbar --><div class='navitem' onclick='{{onclick}}'>  <div class='navitem_text'>{{innerHTML}}</div></div>";
navitem.prototype.k_css = "/********************************* *  navitem *  Created by keleko34 *  a single clickable navitem for the navbar ********************************/.{{local}} .navitem {  position: absolute;  height: 100%;  margin-left:{{left}}px}.{{local}} .navitem:hover {  background: #1b1a1a;  box-shadow: 0px -2px 16px -4px #000 inset;}.{{local}} .navitem:active {  background: #1b1a1a;  box-shadow: 0px -2px 16px -4px #000 inset;}.{{local}} .navitem_text {  cursor: pointer;  color: #F1F1F1;  font-size: 16px;  font-family: 'Open Sans';  text-align: center;  line-height: 60px;  padding: 0px 10px;}";
return navitem;
}());
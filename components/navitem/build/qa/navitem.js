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
  this.top = 0;
  this.title = "";
  this.active = false;
  this.onActive = function(){};
  
  /* Filters */
  this.filters.isActive = function(v)
  {
    return (v ? 'navitem--active' : '');
  }
  
  /* listeners */
  this.listen('navitem',function(value){
    this.active = (this.title === value);
  });
  
  /* ATTRIBUTES */
  this.onclick = function()
  {
    self.alert('page',self.link);
    self.alert('navitem',self.title);
    self.onActive(self.title,self.link);
  }
}

/* PROTOTYPES */

navitem.prototype.k_html = "<!-- navitem Created by keleko34, a single clickable navitem for the navbar --><div class='navitem {{active | isActive}}' onclick='{{onclick}}'>  <div class='navitem_text'>{{title}}</div></div>";
navitem.prototype.k_css = "/********************************* *  navitem *  Created by keleko34 *  a single clickable navitem for the navbar ********************************/.{{local}} .navitem {  position: absolute;  height: 100%;  margin-left:{{left}}px;  top:{{top}}px;}.{{local}} .navitem:hover {  background: #1b1a1a;  box-shadow: 0px -2px 16px -4px #000 inset;}.{{local}} .navitem:active {  background: #1b1a1a;  box-shadow: 0px -2px 16px -4px #000 inset;}.{{local}} .navitem--active {  background: #1b1a1a;  box-shadow: 0px -2px 16px -4px #000 inset;}.{{local}} .navitem_text {  cursor: pointer;  color: #F1F1F1;  font-size: 14px;  font-family: 'Open Sans';  text-align: center;  line-height: 60px;  padding: 0px 10px;  white-space: nowrap;}";
return navitem;
}());
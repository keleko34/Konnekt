if(!K_Components) K_Components = {};
K_Components["slideoutnavmenu"] = (function(){
/*********************************
 *  slideoutnavmenu
 *  Created by keleko34
 *  a touch slide out nav menu
 ********************************/

function slideoutnavmenu(node)
{
  var self = this;
  /* ATTRIBUTES */
  this.isOpen = false;
  
  this.timer = null;
  
  this.menu = node.querySelector('.slideoutnavmenu');
  this.bar = node.querySelector('.slideoutnavmenu__bar')
  
  this.barwidth = window.innerWidth;
  this.barheight = (window.innerHeight-60);
  
  this.menustart = (window.innerWidth-80);
  this.menuend = 0;
  
  this.barstart = 80;
  this.barend = 0;
  
  this.menu.style.left = (this.menustart)+'px';
  
  this.bar.style.left = (this.barstart)+'px';
  
  this.touch = function(isOpen)
  {
    self.isOpen = isOpen;
    if(self.timer)
    {
      clearTimeout(self.timer);
      self.timer = null;
    }
    self.animate(isOpen);
  }
}

slideoutnavmenu.prototype.animate = function(dir)
{
  var self = this,
      start = parseInt(this.menu.style.left),
      startBar = parseInt(this.bar.style.left),
      finish = (dir ? this.menuend : this.menustart),
      finishBar = (dir ? this.barend : this.barstart),
      menu = this.menu,
      bar = this.bar;
  
  function animate(dir)
  {
     var leftMenu = parseInt(menu.style.left),
         leftBar = parseInt(bar.style.left),
         finished = 0;
    if(dir)
    {
      if(leftMenu > finish)
      {
        leftMenu += (-5);
      }
      else
      {
        leftMenu = finish;
        finished += 1;
      }
      if(leftBar > finishBar)
      {
        leftBar += (-2);
      }
      else
      {
        leftBar = finishBar;
        finished += 1;
      }
    }
    else
    {
      if(leftMenu < finish)
      {
        leftMenu += (5);
      }
      else
      {
        leftMenu = finish;
        finished += 1;
      }
      if(leftBar < finishBar)
      {
        leftBar += (2);
      }
      else
      {
        leftBar = finishBar;
        finished += 1;
      }
    }
    
    menu.style.left = leftMenu+'px';
    bar.style.left = leftBar+'px';
    if(finished !== 2) self.timer = setTimeout(function(){
      animate(dir);
    },15)
  }
  animate(dir);
}

/* PROTOTYPES */

slideoutnavmenu.prototype.k_html = "<!-- slideoutnavmenu Created by keleko34, a touch slide out nav menu --><div class='slideoutnavmenu'>  <div class='slideoutnavmenu__hamburger'>    <animated_hamburger ontouch='{{touch}}'></animated_hamburger>  </div>  <div class='slideoutnavmenu__bar'>    <navitem link='intro' title='Home' active='true'></navitem>    <navitem link='documentation' title='Documentation' top='62'></navitem>    <navitem link='get_started' title='Get Started' top='124'></navitem>    <navitem link='download' title='Download' top='186'></navitem>    <navitem link='playground' title='Playground' top='248'></navitem>  </div></div>";
slideoutnavmenu.prototype.k_css = "/********************************* *  slideoutnavmenu *  Created by keleko34 *  a touch slide out nav menu ********************************/.slideoutnavmenu {  position: absolute;  width: 100%;}.slideoutnavmenu__hamburger {  position: absolute;  left: 0px;  z-index: 1;  top: 0px;  height: 25px;  width: 100%;  padding: 17px 30px;  background: #333333;}.slideoutnavmenu__bar {  height:{{barheight}}px;  width:{{barwidth}}px;  background: #1b1a1a;  position: absolute;  top: 60px;}.slideoutnavmenu__bar .navitem {  height: 62px !important;  width: 100%;}.slideoutnavmenu__bar .navitem--active {  border-top: 2px solid #000;}.slideoutnavmenu__bar .navitem_text {  font-size:18px !important;}";
return slideoutnavmenu;
}());
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
  
  this.onChoice = function()
  {
    self.touch(false);
  }
}

slideoutnavmenu.prototype.animate = function(dir)
{
  var self = this,
      start = parseInt(this.menu.style.left),
      startBar = parseInt(this.bar.style.left),
      finish = (dir ? this.menuend : this.menustart),
      finishBar = (dir ? this.barend : this.barstart),
      barFinished = false,
      menu = this.menu,
      bar = this.bar,
      speed = 13;
  
  function animate(dir)
  {
     var leftMenu = parseInt(menu.style.left),
         leftBar = parseInt(bar.style.left),
         finished = false;
    if(dir)
    {
      if(barFinished)
      {
        if(leftMenu + (-speed) > finish)
        {
          leftMenu += (-speed);
        }
        else
        {
          leftMenu = finish;
          finished = true;
        }
      }
      if(leftBar + (-speed) > finishBar)
      {
        leftBar += (-speed);
      }
      else
      {
        leftBar = finishBar;
        barFinished = true;
      }
      menu.style.left = leftMenu+'px';
      bar.style.left = leftBar+'px';
      if(!finished) self.timer = setTimeout(function(){
        animate(dir);
      },10)
    }
    else
    {
      if(leftMenu + (speed) < finish)
      {
        leftMenu += (speed);
      }
      else
      {
        leftMenu = finish;
        finished = true;
      }
      
      if(finished)
      {
        if(leftBar + (speed) < finishBar)
        {
          leftBar += (speed);
        }
        else
        {
          leftBar = finishBar;
          barFinished = true;
        }
      }
      menu.style.left = leftMenu+'px';
      bar.style.left = leftBar+'px';
      if(!barFinished) self.timer = setTimeout(function(){
        animate(dir);
      },10)
    }
  }
  animate(dir);
}

/* PROTOTYPES */

slideoutnavmenu.prototype.k_html = "<!-- slideoutnavmenu Created by keleko34, a touch slide out nav menu --><div class='slideoutnavmenu'>  <div class='slideoutnavmenu__hamburger'>    <animated_hamburger ontouch='{{touch}}'></animated_hamburger>  </div>  <div class='slideoutnavmenu__bar'>    <navitem link='intro' title='Home' active='true' activated='{{onChoice}}'></navitem>    <navitem link='documentation' title='Documentation' top='62' activated='{{onChoice}}'></navitem>    <navitem link='get_started' title='Get Started' top='124' activated='{{onChoice}}'></navitem>    <navitem link='download' title='Download' top='186' activated='{{onChoice}}'></navitem>    <navitem link='playground' title='Playground' top='248' activated='{{onChoice}}'></navitem>  </div></div>";
slideoutnavmenu.prototype.k_css = "/********************************* *  slideoutnavmenu *  Created by keleko34 *  a touch slide out nav menu ********************************/.slideoutnavmenu {  position: absolute;  width: 100%;}.slideoutnavmenu__hamburger {  position: absolute;  left: 0px;  z-index: 1;  top: 0px;  height: 25px;  width: 100%;  padding: 17px 30px;  background: #333333;}.slideoutnavmenu__bar {  height:{{barheight}}px;  width:{{barwidth}}px;  background: #1b1a1a;  position: absolute;  top: 60px;}.slideoutnavmenu__bar .navitem {  height: 62px !important;  width: 100%;}.slideoutnavmenu__bar .navitem--active {  border-top: 2px solid #000;}.slideoutnavmenu__bar .navitem_text {  font-size:18px !important;}";
return slideoutnavmenu;
}());
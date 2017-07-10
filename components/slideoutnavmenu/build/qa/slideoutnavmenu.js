if(typeof window.K_Components === 'undefined') window.K_Components = {};
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
  this.isopen = false;
  
  this.timer = null;
  
  this.menu = node.querySelector('.slideoutnavmenu');
  this.bar = node.querySelector('.slideoutnavmenu__bar')
  
  this.barwidth = window.innerWidth;
  this.barheight = (window.innerHeight-60);
  
  this.menustart = (window.innerWidth-80);
  this.menuend = 0;
  
  this.barstart = 80;
  this.barend = 0;
  
  this.menu_left = this.menustart;
  this.bar_left = this.barstart;
  
  this.touch = function(isOpen)
  {
    if(self.timer)
    {
      clearTimeout(self.timer);
      self.timer = null;
    }
    self.animate(isOpen);
  }
  
  this.onChoice = function()
  {
    self.isopen = false;
    self.touch(false);
  }
}

slideoutnavmenu.prototype.animate = function(dir)
{
  var self = this,
      finish = (dir ? this.menuend : this.menustart),
      finishBar = (dir ? this.barend : this.barstart),
      barFinished = false,
      speed = 13;
  
  function animate(dir)
  {
    if(self.timer)
    {
      clearTimeout(self.timer);
      self.timer = null;
    }
    var finished = false;
    if(dir)
    {
      if(barFinished)
      {
        if(self.menu_left + (-speed) > finish)
        {
          self.menu_left += (-speed);
        }
        else
        {
          self.menu_left = finish;
          finished = true;
        }
      }
      if(self.bar_left + (-speed) > finishBar)
      {
        self.bar_left  += (-speed);
      }
      else
      {
        self.bar_left  = finishBar;
        barFinished = true;
      }
      if(!finished) self.timer = setTimeout(function(){
        animate(dir);
      },10)
    }
    else
    {
      if(self.menu_left + (speed) < finish)
      {
        self.menu_left += (speed);
      }
      else
      {
        self.menu_left = finish;
        finished = true;
      }
      
      if(finished)
      {
        if(self.bar_left + (speed) < finishBar)
        {
          self.bar_left += (speed);
        }
        else
        {
          self.bar_left = finishBar;
          barFinished = true;
        }
      }
      if(!barFinished) self.timer = setTimeout(function(){
        animate(dir);
      },10)
    }
  }
  animate(dir);
}

/* PROTOTYPES */

slideoutnavmenu.prototype.k_html = "<!-- slideoutnavmenu Created by keleko34, a touch slide out nav menu --><div class='slideoutnavmenu'>  <div class='slideoutnavmenu__hamburger'>    <animated_hamburger isopen='{{isopen}}' ontouch='{{touch}}'></animated_hamburger>  </div>  <div class='slideoutnavmenu__bar' style='left:{{bar_left}};'>    <navitem link='intro' title='Home' active='true' activated='{{onChoice}}'></navitem>    <navitem link='documentation' title='Documentation' top='62' activated='{{onChoice}}'></navitem>    <navitem link='get_started' title='Get Started' top='124' activated='{{onChoice}}'></navitem>    <navitem link='download' title='Download' top='186' activated='{{onChoice}}'></navitem>    <navitem link='playground' title='Playground' top='248' activated='{{onChoice}}'></navitem>  </div></div>";
slideoutnavmenu.prototype.k_css = "/********************************* *  slideoutnavmenu *  Created by keleko34 *  a touch slide out nav menu ********************************/.slideoutnavmenu {  position: absolute;  width: 100%;  left:{{menu_left}}px;}.slideoutnavmenu__hamburger {  position: absolute;  left: 0px;  z-index: 1;  top: 0px;  height: 25px;  width: 100%;  padding: 17px 30px;  background: #333333;}.slideoutnavmenu__bar {  height:{{barheight}}px;  width:{{barwidth}}px;  background: #1b1a1a;  position: absolute;  top: 60px;  z-index: 1;}.slideoutnavmenu__bar .navitem {  height: 62px !important;  width: 100%;}.slideoutnavmenu__bar .navitem--active {  border-top: 2px solid #000;}.slideoutnavmenu__bar .navitem_text {  font-size:18px !important;}";
	return slideoutnavmenu;
}());
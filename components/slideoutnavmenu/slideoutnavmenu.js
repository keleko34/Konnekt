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
    if(!finished) self.timer = setTimeout(function(){
      animate(dir);
    },15)
  }
  animate(dir);
}

/* PROTOTYPES */

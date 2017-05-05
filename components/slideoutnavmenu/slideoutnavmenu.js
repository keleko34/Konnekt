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

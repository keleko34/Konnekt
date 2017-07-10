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

/*********************************
 *  animated_hamburger
 *  Created by keleko34
 *  A mobile device menu bar that animates when in a open toggled state
 ********************************/

function animated_hamburger(node)
{
  var self = this;
  /* ATTRIBUTES */
  this.isOpen = false;
  
  this.hamburger = node.querySelector('.animated_hamburger');
  
  this.offset = 20;
  
  this.side = 'left';
  
  this.animation_change = 1;
  this.animation_speed = 10;
  this.timer = null;
  
  this.barOffsets = [0,0,0];
  
  this.onclick = function()
  {
    self.alert('menu_open',!self.isOpen);
    self.toggle();
  }
  this.bars = [
    document.querySelector('.animated_hamburger__bar_1'),
    document.querySelector('.animated_hamburger__bar_2')
  ];
  
  this.ontouch = function(){};
  
  this.touchstart = function(){};
  this.touchend = function(){
    self.toggle();
    self.ontouch(self.isOpen);
  };
  
  this.addDataUpdateListener('isOpen',function(e){
    self.animate(e.value);
  });
}

/* PROTOTYPES */
animated_hamburger.prototype.animate = function(open)
{
  if(this.isOpen === open) return;
  
  var self = this,
      offset = (!open ? 0 : this.offset * (this.side === 'left' ? -1 : 1)),
      offsetmid = (!open ? 0 : (this.offset/2) * (this.side === 'left' ? -1 : 1));
  
  function goLeft()
  {
    if(self.barOffsets[0] > offset)
    {
      self.barOffsets[0] -= (self.animation_change*2);
    }
    else
    {
      self.barOffsets[0] = offset;
    }
    if(self.barOffsets[1] > offsetmid)
    {
      self.barOffsets[1] -= self.animation_change;
    }
    else
    {
      self.barOffsets[1] = offsetmid;
    }
    self.bars[0].style.left = self.barOffsets[0]+"px";
    self.bars[1].style.left = self.barOffsets[1]+"px";
  }
  
  function goRight()
  {
    if(self.barOffsets[0] < offset)
    {
      self.barOffsets[0] += (self.animation_change*2);
    }
    else
    {
      self.barOffsets[0] = offset;
    }
    if(self.barOffsets[1] < offsetmid)
    {
      self.barOffsets[1] += self.animation_change;
    }
    else
    {
      self.barOffsets[1] = offsetmid;
    }
    self.bars[0].style.left = self.barOffsets[0]+"px";
    self.bars[1].style.left = self.barOffsets[1]+"px";
  }
  
  function animate()
  {
    if(open)
    {
      if(self.side === 'left')
      {
        goLeft();
      }
      else
      {
        goRight();
      }
    }
    else
    {
      if(self.side === 'left')
      {
        goRight();
      }
      else
      {
        goLeft();
      }
    }
    if(self.barOffsets[0] !== offset && self.barOffsets[1] !== offsetmid) self.timer = setTimeout(function(){animate();},self.animation_speed);
  }
  
  this.stopChange().isOpen = open;
  animate();
}

animated_hamburger.prototype.toggle = function()
{
  if(this.timer)
  {
    clearTimeout(this.timer);
    this.timer = null;
  }
  this.animate(!this.isOpen);
}
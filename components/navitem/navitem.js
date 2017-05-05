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

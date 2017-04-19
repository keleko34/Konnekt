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
  this.title = "";
  this.isActive = false;
  
  /* Filters */
  this.filters.active = function(v)
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
  }
}

/* PROTOTYPES */

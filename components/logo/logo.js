/*********************************
 *  logo
 *  Created by keleko34
 *  displays main logo
 ********************************/

function logo()
{
  var self = this;
  /* ATTRIBUTES */
  this.navigateHome = function()
  {
    self.alert('page','info');
    self.alert('navitem','intro');
  }
  
  this.navigateMain = function()
  {
    window.location.href = window.location.origin;
  }
}

/* PROTOTYPES */

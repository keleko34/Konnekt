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
    self.alert('page','intro');
    self.alert('navitem','intro');
  }
  
  this.navigateMain = function()
  {
    window.location.href = window.location.origin;
  }
  
  this.size = 'small';
  
  this.filters.toFontSize = function(v)
  {
    if(['small','medium','large'].indexOf(v) !== -1)
    {
      switch(v)
      {
        case 'small':
          return 60;
        case 'medium':
          return 80;
        case 'large':
          return 120;
      }
    }
    return 60;
  }
  
  this.filters.toImageSrc = function(v)
  {
    if(['small','medium','large'].indexOf(v) !== -1)
    {
      switch(v)
      {
        case 'small':
          return 'logo';
        case 'medium':
          return 'logo@2x';
        case 'large':
          return 'logo@3x';
      }
    }
    return 'logo';
  }
  
  this.filters.toImageSize = function(v)
  {
    return (parseInt(v,10)/2 + 4);
  }
  
}

/* PROTOTYPES */

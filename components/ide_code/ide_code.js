/*********************************
 *  ide_code
 *  Created by keleko34
 *  to show a snippet of code
 ********************************/

function ide_code()
{
  /* ATTRIBUTES */
  this.theme = 'dark';
  this.code = "";
  this.ref = "";
  
  this.copyable = true;
  
  this.filters.toDisplay = function(v)
  {
    return (v ? 'block' : 'none');
  }
  
  this.onFinish = function()
  {
    this.ref = "."+this.local+" .ide_code__code";
  }
}

/* PROTOTYPES */

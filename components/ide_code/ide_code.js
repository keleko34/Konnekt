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
  
  this.copyable = true;
  
  this.copy = function()
  {
    var range = document.createRange(),
        selector;
    range.selectNode(document.querySelector(this.local+' .ide_code__inner'));

    selector = window.getSelection();
    selector.removeAllRanges();
    selector.addRange(range);

    try {
        document.execCommand("copy");
    } 
    catch(e){}

    selector.removeAllRanges();
  }
  
  this.filters.toDisplay = function(v)
  {
    return (v ? 'block' : 'none');
  }
}

/* PROTOTYPES */

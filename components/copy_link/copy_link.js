/*********************************
 *  copy_link
 *  Created by keleko34
 *  to copy a set of text
 ********************************/

function copy_link()
{
  var self = this;
  /* ATTRIBUTES */
  this.title = "Copy";
  this.ref = "";
  
  this.click = function()
  {
    var range = document.createRange(),
        selector;
    range.selectNode(document.querySelector(self.ref));

    selector = window.getSelection();
    selector.removeAllRanges();
    selector.addRange(range);

    try {
        document.execCommand("copy");
    } 
    catch(e){}

    selector.removeAllRanges();
  }
}

/* PROTOTYPES */

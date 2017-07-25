if(typeof window.K_Components === 'undefined') window.K_Components = {};
K_Components["copy_link"] = (function(){
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

copy_link.prototype.k_html = "<!-- copy_link Created by keleko34, to copy a set of text --><div class='copy_link' onclick='{{click}}'>  <div class='copy_link__content'>{{title}}</div></div>";
copy_link.prototype.k_css = "/********************************* *  copy_link *  Created by keleko34 *  to copy a set of text ********************************/.copy_link {  text-align: center;  background: #79b7de;    border-radius: 5px;  cursor: pointer;  box-shadow: 0px 3px 10px -5px #828282;  border: 1px solid #bababa;}.desktop .copy_link {  width: 75px;  font-size:16px;  height: 35px;}.mobile .copy_link {  width: 100px;  font-size:22px;  height: 43px;}.copy_link:active {  box-shadow: 0px 3px 11px -4px #828282 inset;  border: 1px solid #bababa;}.copy_link__content {  color: #F1F1F1;}.desktop .copy_link__content {  line-height: 35px;}.mobile .copy_link__content {  line-height: 43px;}";
	return copy_link;
}());
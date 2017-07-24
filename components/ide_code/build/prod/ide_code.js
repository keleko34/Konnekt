if(typeof window.K_Components === 'undefined') window.K_Components = {};
K_Components["ide_code"] = (function(){
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

ide_code.prototype.k_html = "<!-- ide_code Created by keleko34, to show a snippet of code --><div class='ide_code ide_code--{{theme}}'>  <div class='ide_code__outer'>    <div class='ide_code__inner'>      <div class='ide_code__code'>{{code}}</div>    </div>  </div>  <div style='display:{{copyable | toDisplay}}'>    <link click='{{copy}}' title='Copy'></link>  </div></div>";
ide_code.prototype.k_css = "/********************************* *  ide_code *  Created by keleko34 *  to show a snippet of code ********************************/.ide_code {  width:100%;}.ide_code__outer {  width:100%;}.ide_code__inner {  padding: 15px;  font-size: 14px;  font-family: 'open sans';  margin:10px;}.ide_code__code {  }.ide_code--dark .ide_code__outer {  background: #333;  box-shadow: 0px 0px 8px 0px #000 inset;  border: 1px solid #000;}.ide_code--dark .ide_code__inner {  color: #888;}.ide_code--dark .ide_code__code {  color: #F1F1F1;}.ide_code--light .ide_code__outer {  }.ide_code--light .ide_code__inner {  }.ide_code--light .ide_code__code {  }";
	return ide_code;
}());
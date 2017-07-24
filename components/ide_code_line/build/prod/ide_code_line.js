if(typeof window.K_Components === 'undefined') window.K_Components = {};
K_Components["ide_code_line"] = (function(){
	/*********************************
 *  ide_code_line
 *  Created by keleko34
 *  shows a line on the ide code component
 ********************************/

function ide_code_line()
{
  /* ATTRIBUTES */
  this.code = "";
}

/* PROTOTYPES */

ide_code_line.prototype.k_html = "<!-- ide_code_line Created by keleko34, shows a line on the ide code component --><div class='ide_code_line'>  <div class='ide_code_line__number'>{{loop_id}}</div>  <span class='ide_code_line__text'>{{code}}</span></div>";
ide_code_line.prototype.k_css = "/********************************* *  ide_code_line *  Created by keleko34 *  shows a line on the ide code component ********************************/.ide_code_line {}.ide_code_line__number {  -webkit-touch-callout: none;  -webkit-user-select: none;  -khtml-user-select: none;  -moz-user-select: none;  -ms-user-select: none;  user-select: none;  float:left;  margin-right: 10px;}.ide_code_line__text {  -webkit-touch-callout: text;  -webkit-user-select: text;  -khtml-user-select: text;  -moz-user-select: text;  -ms-user-select: text;  user-select: text;  cursor: text;}.ide_code--dark .ide_code_line__text {  color:#F1F1F1;}.ide_code--light .ide_code_line__text {  }";
	return ide_code_line;
}());
if(typeof window.K_Components === 'undefined') window.K_Components = {};
K_Components["link"] = (function(){
	/*********************************
 *  link
 *  Created by keleko34
 *  a link to an action
 ********************************/

function link()
{
  /* ATTRIBUTES */
  this.click = function(){};
  this.title = "";
}

/* PROTOTYPES */

link.prototype.k_html = "<!-- link Created by keleko34, a link to an action --><div class='link' onclick='{{click}}'>  <div class='link__content'>{{title}}</div></div>";
link.prototype.k_css = "/********************************* *  link *  Created by keleko34 *  a link to an action ********************************/.link {  }.link__content {  }";
	return link;
}());
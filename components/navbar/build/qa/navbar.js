if(!K_Components) K_Components = {};
K_Components["navbar"] = (function(){
/*********************************
 *  navbar
 *  Created by keleko34
 *  the header navbar for the site
 ********************************/

function navbar()
{
  /* ATTRIBUTES */
  
}

/* PROTOTYPES */

navbar.prototype.k_html = "<!-- navbar Created by keleko34, the header navbar for the site --><div class='navbar'>  <logo></logo>  <navitem link='documentation' left='190' title='Documentation'></navitem>  <navitem link='get_started' left='313' title='Get Started'></navitem>  <navitem link='download' left='408' title='Download'></navitem>  <navitem link='playground' left='495' title='Playground'></navitem></div>";
navbar.prototype.k_css = "/********************************* *  navbar *  Created by keleko34 *  the header navbar for the site ********************************/.navbar {  position: relative;  height:60px;  background:#333;  border-bottom: 2px solid #000;  box-shadow: 0px 0px 8px -2px #000;}";
return navbar;
}());
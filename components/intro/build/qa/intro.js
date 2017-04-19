if(!K_Components) K_Components = {};
K_Components["intro"] = (function(){
/*********************************
 *  intro
 *  Created by keleko34
 *  This is an introductory page that shows some basic info about the konnekt library and its cool benifits
 ********************************/

function intro()
{
  var self = this;
  
  /* ATTRIBUTES */
  this.offset = 0;
  
  /* FILTERS */
  this.filters.offsetHeight = function(v)
  {
    return (window.innerHeight-parseInt(v,10));
  }
  
  window.addEventListener('resize',function(){
    self.offset = self.offset;
  });
}

/* PROTOTYPES */

intro.prototype.k_html = "<!-- intro Created by keleko34, This is an introductory page that shows some basic info about the konnekt library and its cool benifits --><div class='intro'>  </div>";
intro.prototype.k_css = "/********************************* *  intro *  Created by keleko34 *  This is an introductory page that shows some basic info about the konnekt library and its cool benifits ********************************/.intro {  overflow:hidden;  height:{{offset | offsetHeight}}px;  width:100%;  background:#1D1F21;}";
return intro;
}());
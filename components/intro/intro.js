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

/*********************************
 *  intro
 *  Created by keleko34
 *  This is an introductory page that shows some basic info about the konnekt library and its cool benifits
 ********************************/

function intro()
{
  var self = this;
  
  this.offset = 0;
  /* ATTRIBUTES */
  this.height = (window.innerHeight-this.offset);
  
  window.addEventListener('resize',function(){
    self.height = (window.innerHeight-self.offset);
  });
}

/* PROTOTYPES */

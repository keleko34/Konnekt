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
  this.height = 0;
  
  
  this.listen('app_height',function(value){
    this.height = (value-this.offset);
  });
  
  this.onFinish = function()
  {
    this.height = (window.innerHeight-this.offset);
  }
}

/* PROTOTYPES */

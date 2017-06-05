/*********************************
 *  intro
 *  Created by keleko34
 *  This is an introductory page that shows some basic info about the konnekt library and its cool benifits
 ********************************/

function intro()
{
  var self = this;
  
  /* ATTRIBUTES */
  this.offsettop = 0;
  this.height = 0;
  this.falsey = false;
  
  this.size = (Konnekt.device.type === 'desktop' ? 'large' : 'medium');
  
  this.listen('app_height',function(value){
    this.height = (value-this.offsettop);
  });
  
  this.onFinish = function()
  {
    this.height = (window.innerHeight-this.offsettop);
  }
}

/* PROTOTYPES */
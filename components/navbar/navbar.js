/*********************************
 *  navbar
 *  Created by keleko34
 *  the header navbar for the site
 ********************************/

function navbar()
{
  /* ATTRIBUTES */
  this.isMobile = (Konnekt.device.type === 'mobile' || (Konnekt.device.type === 'tablet' && Konnekt.device.orientation === 'portrait'));
  
  this.listen('app_orientation',function(value){
    this.isMobile = (Konnekt.device.type === 'mobile' || (Konnekt.device.type === 'tablet' && value === 'portrait'))
  });
  
    
  this.filters.notHidden = function(v)
  {
    return (!v ? 'none' : 'block');
  }
  
    
  this.filters.isHidden = function(v)
  {
    return (v ? 'none' : 'block');
  }
}

/* PROTOTYPES */

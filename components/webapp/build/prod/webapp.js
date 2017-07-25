if(typeof window.K_Components === 'undefined') window.K_Components = {};
K_Components["webapp"] = (function(){
	/*********************************
 *  webapp
 *  Created by keleko34
 *  The main entry point for the konnekt web app
 ********************************/

function webapp()
{
  var self = this;
  /* ATTRIBUTES */
  this.page = window.location.hash.replace('#','') || "intro";
  this.nav = this.getNav();
  
  this.listen('page',function(value){
      window.location.hash = "#"+value;
  });
  
  window.addEventListener('resize',function(){
    self.alert('app_width',window.innerWidth);
    self.alert('app_height',window.innerHeight);
    self.alert('app_device',Konnekt.device.type);
    self.alert('app_orientation',Konnekt.device.orientation);
    self.alert('app_browser',Konnekt.device.browser);
    self.alert('app_keyboard',Konnekt.device.keyboard);
    self.alert('app_screensize',Konnekt.device.screenSize);
    self.alert('app_orientationsize',Konnekt.device.orientationSize);
    self.nav = self.getNav();
  });
  
  Konnekt.addHashRouter(function(e){
    e.preventDefault();
    self.page = e.hash;
  });
}

/* PROTOTYPES */
webapp.prototype.getNav = function()
{
  if(['mobile','tablet'].indexOf(Konnekt.device.type) !== -1)
  {
    if(Konnekt.device.type === 'tablet' && Konnekt.device.orientation === 'landscape')
    {
      return 'navbar';
    }
    return 'mobilenavbar';
  }
  else
  {
    return 'navbar';
  }
}
webapp.prototype.k_html = "<!-- webapp Created by keleko34, The main entry point for the konnekt web app --><div class='webapp'>  <{{nav}}></{{nav}}>  <div class='webapp__content'>    <{{page}} offsettop='62'></{{page}}>  </div></div>";
webapp.prototype.k_css = "/********************************* *  webapp *  Created by keleko34 *  The main entry point for the konnekt web app ********************************/.webapp {  }.webapp__footer {}";
	return webapp;
}());
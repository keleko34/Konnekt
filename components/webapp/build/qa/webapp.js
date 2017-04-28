if(!K_Components) K_Components = {};
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
  this.page = "intro";
  
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
  });
  
  Konnekt.addHashRouter(function(e){
    e.preventDefault();
    //self.page = e.hash;
    console.log(e.hash);
  });
}

/* PROTOTYPES */

webapp.prototype.k_html = "<!-- webapp Created by keleko34, The main entry point for the konnekt web app --><div class='webapp'>  <navbar></navbar>  <div class='webapp__content'>    <{{page}} offset='62'></{{page}}>  </div></div>";
webapp.prototype.k_css = "/********************************* *  webapp *  Created by keleko34 *  The main entry point for the konnekt web app ********************************/.webapp {}";
return webapp;
}());
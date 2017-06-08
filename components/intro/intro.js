/*********************************
 *  intro
 *  Created by keleko34
 *  This is an introductory page that shows some basic info about the konnekt library and its cool benifits
 ********************************/

function intro(node)
{
  var self = this;
  
  /* ATTRIBUTES */
  this.offsettop = 0;
  this.height = 0;
  this.falsey = false;
  this.infosection = node.querySelector('.intro__platform');
  this.intro = node.querySelector('.intro');
  
  this.size = (Konnekt.device.type === 'desktop' ? 'large' : 'medium');
  
  this.listen('app_height',function(value){
    this.height = (value-this.offsettop);
  });
  
  this.onFinish = function()
  {
    this.height = (window.innerHeight-this.offsettop);
  }
  
  this.gotoInfo = function(e)
  {
    var offset = (self.intro.scrollHeight - self.infosection.clientHeight),
        currentScroll = self.intro.scrollTop,
        startAnim = 20,
        currAnim = startAnim,
        timer,
        finished = false,
        old = currentScroll;
    
    if(currentScroll < offset)
    {
      function getPercent()
      {
        var perc = ((currentScroll/offset)*100);
        if(perc >= 65)
        {
          var currPerc = ((perc - 65) * 100) / (100 - 65);
              currAnim = startAnim - (startAnim * (currPerc/100));
          if(currAnim < 1) currAnim = 1;
          
        }
      }

      function animate()
      {
        if(timer)
        {
          clearTimeout(timer);
          timer = null;
        }
        currentScroll = self.intro.scrollTop;
        if((currentScroll + currAnim) >= offset)
        {
          currentScroll = offset;
          finished = true;
        }
        else
        {
          currentScroll += currAnim;
          self.intro.scrollTop = currentScroll;
          getPercent();
        }
        if((currentScroll === old))
        {
          currentScroll = offset;
          finished = true;
        }
        old = currentScroll;
        if(!finished) timer = setTimeout(function(){animate();},10);
      }
      
      animate();
    }
    
  }
}

/* PROTOTYPES */
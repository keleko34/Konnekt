/*********************************
 *  todoapp
 *  Created by keleko34
 *  This is the main initiator for the todoapp
 ********************************/

function todoapp()
{
  var self = this;
  /* the main title */
  this.title = "todo";
  this.fontSize = 40;
  this.color = "#c8c8c8";
  
  /* a simple filter that returns uppercase string */
  this.filters.toUpperCase = function(v)
  {
    return v.toUpperCase();
  }
  
  this.listen('todoapp__todolist','complete',function(e){
    if(!e.initial) this.flash(e);
  });
  
  this.titleclick = function(e)
  {
    self.getdata();
  }
}

todoapp.prototype.flash = function(e){
  this.color = (parseInt(e.oldValue,10) < parseInt(e.value,10) ? "rgba(125, 183, 112, 1)" : "rgba(251, 127, 127, 1)"); //endresult = rgb(200, 200, 200)
  var self = this;
  function rec()
  {
    var curColors = (self.color).replace(/[rgba\(\)\s]/g,'').split(',');
    curColors.splice(3,1);
    var allFinished = 0;
    curColors = curColors.map(function(x){
      x = parseInt(x,10);
      if(x === 200)
      {
        allFinished += 1;
      }
      return (x < 200 ? (x+1) : (x > 200 ? (x-1) : 200));
    });
    self.color = "rgba("+curColors.join(",")+", 1)"
    if(allFinished !== 3) setTimeout(function(){rec();},15);
  };
  rec();
}

todoapp.prototype.getdata = function()
{
  var json = JSON.stringify({title:"something else",subinfo:"Some extra info"});
  this.parse(json);
}

/* PROTOTYPES */

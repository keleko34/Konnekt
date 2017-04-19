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
  
  this.listen('.todoapp__todolist','complete',function(e){
    this.flash();
  });
}

todoapp.prototype.flash = function(){
  this.color = "rgba(125, 183, 112, 1)"; //endresult = rgb(200, 200, 200)
  (function rec()
  {
    var curColors = (this.color).replace(/[rgba\(\)\s]/g,'').split(',');
    curColors.splice(3,1);
    var allFinished = 0;
    curColors = curColors.map(function(x){
      x = parseInt(x,10);
      if(x === 200)
      {
        allFinished += 1;
      }
      return (x < 200 ? (x+1) : 200);
    });
    if(allFinished !== 3) setTimeout(function(){rec();},5);
  }).bind(this);
  setTimeout(function(){rec();},5);
}

/* PROTOTYPES */

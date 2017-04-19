if(!K_Components) K_Components = {};
K_Components["todoapp"] = (function(){
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

todoapp.prototype.k_html = "<!-- todoapp Created by keleko34, This is the main initiator for the todoapp --><div class='todoapp'>  <div class='todoapp__title' onclick='{{clickme}}'>{{title | toUpperCase}}</div>  <div class='todoapp__inforomation'>    <a href='#todoinformation'><img class='todoapp__inforomation__icon' src='../../assets/img/icons/information.svg' /></a>  </div>  <div class='todoapp__list'>    <todolist id='todoapp__todolist'></todolist>  </div></div>";
todoapp.prototype.k_css = "/********************************* *  todoapp *  Created by keleko34 *  This is the main initiator for the todoapp ********************************/.todoapp {    background: #F2F2F2;    width: 100%;    height: 100%;    position: absolute;}.todoapp__title {    font-family: sans-serif;    color: {{color}};    font-size: {{fontSize}}px;    margin: 50px auto 10px auto;    width: 600px;    text-align: center;}.todoapp__inforomation {  position: absolute;  left: 50%;  top: 45px;  margin-left: 60px;}.todoapp__inforomation__icon {  width:16px;  height:16px;  cursor: pointer;}.todoapp__list {  width: 600px;  margin: 0px auto;  height: 400px;  background: #ffffff;  border-radius: 3px;  box-shadow: 0px 3px 12px -3px #333;}";
return todoapp;
}());
if(!K_Components) K_Components = {};
K_Components["tester"] = (function(){
function tester()
{
  var self = this;
  this.user_name = "Default";
  this.color = "#000";
  this.changebackground = function()
  {
    self.color = "#CCC";
  }
};

tester.prototype.k_html = "<div class='tester'>  <div>{{user_name}}</div>  <button onclick='{{changebackground}}'>Change background</button>  <div>{{innerHTML}}</div></div>";
tester.prototype.k_css = ".{{local}} .tester {  background:{{color}};  color:#FFF;}";
return tester;
}());
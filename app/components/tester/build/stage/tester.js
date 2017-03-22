if(!K_Components) K_Components = {};
K_Components["tester"] = (function(){
function tester()
{
  this.user_name = "Default";
};

tester.prototype.k_html = "<div>{{user_name}}</div>";
tester.prototype.k_css = ".tester {  background:#000;  color:#FFF;}";
return tester;
}());
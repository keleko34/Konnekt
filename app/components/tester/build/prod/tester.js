function tester()
{
  this.testerVal = "";
  this.onclickyay = function(){
    console.log('prevyay');
    console.log(this.tester);
  }
}

tester.prototype.tester = function(){

};

tester.prototype.k_html = "<div class='{{yay}}' onclick='{{onclickyay}}'>{{innerHTML}}</div>";
tester.prototype.k_css = ".tester {  background:#000;  color:#FFF;}";
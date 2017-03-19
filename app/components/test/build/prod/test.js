function test()
{
  this.onclickyay = function(e){
    console.log("yay");
  };
}

test.prototype.test = function(){

};


test.prototype.yay = "yay";

test.prototype.k_html = "<div class='test' something = 'something'>  <div>{{yay}}</div>  <tester yay='{{yay}}' onclickyay='{{onclickyay}}'>Some inner Text</tester></div>";
test.prototype.k_css = ".test {  background:#000;  color:#FFF;}";
function test()
{
  this.yay = "yay";
}

test.prototype.test = function(){

};

test.prototype.k_html = "<div class='test' something = 'something'><div>{{yay}}</div><tester yay='{{yay}}'>Some inner Text</tester></div>";
test.prototype.k_css = ".test {}";

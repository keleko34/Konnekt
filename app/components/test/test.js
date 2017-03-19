function test()
{
  this.yay = "yay";
  this.myevent = function(e){
    console.log("yay for reals!");
  };
  
  this.something = "really something"
}

test.prototype.test = function(){

};

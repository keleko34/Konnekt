function test()
{
  var self = this;
  
  this.yay = "yay";
  this.val = "";
  this.items = [
    {user_name:"jerry"},
    {user_name:"tom"},
    {user_name:"cooldude"},
    {user_name:"something something something"}
  ];
  
  this.oninput = function(e)
  {
    self.yay = self.val;
  }
}

test.prototype.test = function(){

};

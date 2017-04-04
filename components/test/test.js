function test()
{
  var self = this;
  
  this.multiple = true;
  
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
  
  this.onFinish = function(node)
  {
    console.log(node.innerHTML);
  }
  
  this.filters.toUpperCase = function(v)
  {
    return v.toUpperCase();
  }
}

test.prototype.test = function(){

};

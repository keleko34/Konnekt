function tester()
{
  this.yay = "cool";
  this.testerVal = "";
  this.onclickyay = function(){
    console.log('prevyay');
    console.log(this.tester);
  };
};

tester.prototype.tester = function(){

};

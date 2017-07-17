if(!K_Components) K_Components = {};
K_Components["hello"] = (function(){
/*********************************
 *  hello
 *  Created by keleko34
 *  test
 ********************************/

function hello()
{
  /* ATTRIBUTES */
  this.coolbeans = 'class';
  this.something = 'hello-class';

}

/* PROTOTYPES */

hello.prototype.k_html = "<!-- hello Created by keleko34, test --><div {{coolbeans}}='{{something}}'>Hello!</div>";
hello.prototype.k_css = "/********************************* *  hello *  Created by keleko34 *  test ********************************/.hello {}";
return hello;
}());
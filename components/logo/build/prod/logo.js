if(!K_Components) K_Components = {};
K_Components["logo"] = (function(){
/*********************************
 *  logo
 *  Created by keleko34
 *  displays main logo
 ********************************/

function logo()
{
  var self = this;
  /* ATTRIBUTES */
  this.onclick = function()
  {
    self.alert('page','intro');
    self.alert('navitem','intro');
  }
}

/* PROTOTYPES */

logo.prototype.k_html = "<!-- logo Created by keleko34, displays main logo --><div class='logo' onclick='{{onclick}}'>  <div class='logo__container'><img class='logo__container__img' src='./assets/img/logo/logo.png' /></div>  <div class='logo__text'>Konnekt</div></div>";
logo.prototype.k_css = "/********************************* *  logo *  Created by keleko34 *  displays main logo ********************************/.logo {  position: absolute;  height: 60px;  width: 190px;  cursor: pointer;}.logo__container {  position: absolute;  left: 10px;  top: 10px;}.logo__container__img {  height: 34px;}.logo__text {    position: absolute;    left: 62px;    top: -1px;    font-family: 'wolf_in_the_cityregular';    font-size: 60px;    color: #87cefa;}";
return logo;
}());
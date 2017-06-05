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
  this.navigateHome = function()
  {
    self.alert('page','intro');
    self.alert('navitem','intro');
  }
  
  this.navigateMain = function()
  {
    window.location.href = window.location.origin;
  }
  
  this.size = 'small';
  
  this.filters.toFontSize = function(v)
  {
    if(['small','medium','large'].indexOf(v) !== -1)
    {
      switch(v)
      {
        case 'small':
          return 60;
        case 'medium':
          return 80;
        case 'large':
          return 120;
      }
    }
    return 60;
  }
  
  this.filters.toImageSrc = function(v)
  {
    if(['small','medium','large'].indexOf(v) !== -1)
    {
      switch(v)
      {
        case 'small':
          return 'logo';
        case 'medium':
          return 'logo@2x';
        case 'large':
          return 'logo@3x';
      }
    }
    return 'logo';
  }
  
  this.filters.toImageSize = function(v)
  {
    return (parseInt(v,10)/2 + 4);
  }
  
}

/* PROTOTYPES */

logo.prototype.k_html = "<!-- logo Created by keleko34, displays main logo --><div class='logo logo--{{size}}'>  <div class='logo__container' onclick='{{navigateMain}}'><img class='logo__container__img' src='./assets/img/logo/{{size | toImageSrc}}.png' /></div>  <div class='logo__text' onclick='{{navigateHome}}'>Konnekt</div></div>";
logo.prototype.k_css = "/********************************* *  logo *  Created by keleko34 *  displays main logo ********************************/.logo {  position: absolute;  height: 60px;  width: 190px;  cursor: pointer;}.logo__container {  position: absolute;  left: 10px;  top: 10px;}.{{local}} .logo--small .logo__container__img {  height: 34px;}.{{local}} .logo--medium .logo__container__img {  height: 58px;}.{{local}} .logo--large .logo__container__img {  height: 64px;}.logo__text {    position: absolute;    font-family: 'wolf_in_the_cityregular';    color: #87cefa;}.{{local}} .logo--small .logo__text {    left: 62px;    top: -1px;    font-size: 60px;}.{{local}} .logo--medium .logo__text {    left: 88px;    top: -8px;    font-size: 100px;}.{{local}} .logo--large .logo__text {    left: 107px;    top: -14px;    font-size: 120px;}";
return logo;
}());
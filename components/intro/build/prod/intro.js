if(!K_Components) K_Components = {};
K_Components["intro"] = (function(){
/*********************************
 *  intro
 *  Created by keleko34
 *  This is an introductory page that shows some basic info about the konnekt library and its cool benifits
 ********************************/

function intro()
{
  var self = this;
  
  /* ATTRIBUTES */
  this.offsettop = 0;
  this.height = 0;
  
  this.size = (Konnekt.device.type === 'desktop' ? 'large' : 'medium');
  
  this.listen('app_height',function(value){
    this.height = (value-this.offsettop);
  });
  
  this.onFinish = function()
  {
    this.height = (window.innerHeight-this.offsettop);
  }
}

/* PROTOTYPES */
intro.prototype.k_html = "<!-- intro Created by keleko34, This is an introductory page that shows some basic info about the konnekt library and its cool benifits --><div class='intro'>  <div class='intro__content'>    <div class='intro__content__left'>      <logo size='{{size}}' islinked='false'></logo>      <div class='intro__content__install'>        <div class='intro__content__install__inner'>          <div class='intro__content__install__line'>1.</div>          <span class=' intro__content__install__text intro__content__install__text__1'>npm </span>          <span class='intro__content__install__text intro__content__install__text__2'>install </span>          <span class='intro__content__install__text intro__content__install__text__3'>konnekt</span>        </div>      </div>    </div>    <div class='intro__content__right'>      <div class='intro__content__types'>HTML, CSS, JS</div>      <div class='intro__content__title'>Konnekt Framework</div>      <ul class='intro__content__list'>        <li>          <span>Apps are: </span>        </li>        <li>          - Simple        </li>        <li>          - Modular        </li>        <li>          - Designer friendly        </li>        <li>          - Two way bindable        </li>      </ul>      <div class='intro__content__links'>        <navitem link='get_started' title='Get Started'></navitem>        <navitem link='documentation' left='140' title='Documentation'></navitem>      </div>    </div>  </div>  <div class='intro__arrow'></div></div>";
intro.prototype.k_css = "/********************************* *  intro *  Created by keleko34 *  This is an introductory page that shows some basic info about the konnekt library and its cool benifits ********************************/.intro {  overflow-x:hidden;  overflow-y:auto;  height:{{height}}px;  width:100%;  background:#1D1F21;  position: relative;}.intro .logo {  cursor: default !important;}.intro__arrow {  position: absolute;  left: 50%;  cursor: pointer;  background: url('/assets/img/icons/down-arrow.svg') no-repeat;  height: 80px;  width:80px;  background-size: contain;}.desktop .intro__arrow {  top: 420px;  margin-left: -16px;}.mobile .intro__arrow {  top: 450px;  margin-left: -40px;}.intro__arrow:hover {  background: url('/assets/img/icons/down-arrow-active.svg') no-repeat;  background-size: contain;}.intro__arrow:active {  background: url('/assets/img/icons/down-arrow-active.svg') no-repeat;  background-size: contain;}.desktop .intro__content {  width:800px;  height:400px;  position: absolute;  margin-left:-400px;  top:0px;  left:50%;}.mobile .intro__content {  width: 100%;}.desktop .intro__content__left {  float: left;  height: 220px;  width: 348px;  margin: 70px 0px 30px 50px;  padding: 70px 0px 0px 25px;  border-right: 1px solid #565656;  box-shadow: 8px 0px 8px -6px #000;  position: relative;}.mobile .intro__content__left {  height: 102px;  width: 280px;  padding-left: 10px;  margin: 0px auto;  margin-top: 25px;  position: relative;}.intro__content__right {  font-family: 'open sans';  color: #F1F1F1;  position: relative;}.desktop .intro__content__right {  float: left;  width: 300px;  height: 250px;  padding-top: 85px;  padding-left:25px;}.mobile .intro__content__right {  margin-top:20px;  text-align: center;}.intro__content__types {  font-size: 14px;  color: lightskyblue;  font-weight:500;}.intro__content__title {  font-size: 28px;  font-weight: 300;  margin-top: 15px;}.desktop .intro__content__list {  font-size: 14px;  margin-top: 20px;  font-weight: 600;  color: #888;}.mobile .intro__content__list {  font-size: 16px;  font-weight: 400;  margin-top: 30px;  width: 170px;  height: 170px;  text-align: left;  border-left: 1px solid #444;  border-right: 1px solid #444;  padding-left: 30px;  position: absolute;  left: 50%;  margin-left: -100px;  color: #888;}.intro__content__list li {  margin-top: 15px;}.intro__content__list span {  color:#F1F1F1;}.intro__content__install {  position: absolute;  width: 300px;}.desktop .intro__content__install {  bottom: 20px;  left: 30px;  background: #333;  box-shadow: 0px 0px 8px 0px #000 inset;  border: 1px solid #000;}.mobile .intro__content__install {  bottom: -15px;  left: 5px;}.intro__content__install__inner {  height: 15px;  padding: 15px;  font-size: 14px;  font-family: 'open sans';  color: #888;}.desktop .intro__content__install__inner {  margin: 10px;  background: #1d1f21;}.intro__content__install__inner div {  float: left;}.intro__content__install__line {  margin-right: 10px;}.mobile .intro__content__install__line {  display:none;}.intro__content__install__text {  -webkit-user-select: text;  user-select: text;  cursor:text;}.desktop .intro__content__install__text__1 {  color: #84a2ea;}.desktop .intro__content__install__text__2 {  color: #bc68d6;}.desktop .intro__content__install__text__3 {  color: #F1F1F1;}.intro__content__links {  margin-top: 20px;  position: relative;  height:20px;}.mobile .intro__content__links {  display:none;}.intro__content__links .navitem {  padding: 10px;  text-align: center;  background: #78c1ff;  border-radius: 3px;  box-shadow: 0px 1px 4px 0px #000;  border: 1px solid rgba(0, 0, 0, 0.5);  color: #1d1f21;  font-weight: 600;  cursor: pointer;  float: left;  margin-right: 10px;}.intro__content__links .navitem:hover {  background: #5096d2 !important;  box-shadow: none !important;}.intro__content__links .navitem:active {  background: #4a89bf !important;  box-shadow: 0px 0px 4px 0px #000 !important;}.intro__content__links .navitem_text {  color: #1d1f21 !important;  line-height:20px !important;}";
return intro;
}());
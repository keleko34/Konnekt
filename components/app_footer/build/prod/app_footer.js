if(typeof window.K_Components === 'undefined') window.K_Components = {};
K_Components["app_footer"] = (function(){
	/*********************************
 *  app_footer
 *  Created by keleko34
 *  to show footer content on the app
 ********************************/

function app_footer()
{
  /* ATTRIBUTES */
}

/* PROTOTYPES */

app_footer.prototype.k_html = "<!-- app_footer Created by keleko34, to show footer content on the app --><div class='app_footer'>  <div class='app_footer__resources'>    <div class='app_footer__resources__title'>More Resources</div>    <div class='app_footer__resources__list'>      <div class='app_footer__resources__list_title'>Project</div>      <div class='app_footer__resources__list_link'>        <a href='https://github.com/keleko34/Konnekt/'>Github</a>      </div>      <div class='app_footer__resources__list_link'>        <a href='https://www.npmjs.com/package/konnekt/'>NPM</a>      </div>      <div class='app_footer__resources__list_link'>        <a href='https://trello.com/b/X55aqPpM/konnektjs/'>Trello</a>      </div>    </div>    <div class='app_footer__resources__list'>      <div class='app_footer__resources__list_title'>Learn</div>      <div class='app_footer__resources__list_link'>        <a href='#documentation'>Documentation</a>      </div>      <div class='app_footer__resources__list_link'>        <a href='#get_started'>Getting Started</a>      </div>      <div class='app_footer__resources__list_link'>        <a href='#playground'>Playground</a>      </div>      <div class='app_footer__resources__list_link'>        <a href='https://gitter.im/konnektjs/Lobby/'>Gitter</a>      </div>    </div>  </div></div>";
app_footer.prototype.k_css = "/********************************* *  app_footer *  Created by keleko34 *  to show footer content on the app ********************************/.app_footer {  border-top: 3px solid #79b7de;  height: 250px;  width:100%;  background:#333;  color:#F1F1F1;  font-family: 'open sans';}.mobile .app_footer {  padding: 0 20px;}.desktop .app_footer__resources {  width: 800px;  margin: 0 auto;}.app_footer__resources__title {  font-weight: 300;  color: #F1F1F1;  padding: 15px 0px;  font-size: 36px;}.app_footer__resources__list {    float: left;    margin-right: 50px;}.app_footer__resources__list_title {  color: #79b7de;  font-weight: 600;  font-size: 18px;}.app_footer__resources__list_link {  margin-top:10px;}.app_footer__resources__list_link:hover {  text-decoration: underline;}.app_footer__resources__list_link a, app_footer__resources__list_link a:active {  color:#F1F1F1;  text-decoration: none;}";
	return app_footer;
}());
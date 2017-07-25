if(typeof window.K_Components === 'undefined') window.K_Components = {};
K_Components["get_started"] = (function(){
	/*********************************
 *  get_started
 *  Created by keleko34
 *  shows how to get started using the library
 ********************************/

function get_started()
{
  /* ATTRIBUTES */
  this.step_1 = "npm install --global konnekt-cli";
}

/* PROTOTYPES */

get_started.prototype.k_html = "<!-- get_started Created by keleko34, shows how to get started using the library --><div class='get_started'>  <div class='get_started__title'>Getting Started</div>  <div class='get_started__types'>    <div class='get_started__types__text'>      There are two ways to set up a project, You can either use the <a class='cli' href='#download'>CLI Tool</a> or you can <a class='lib' href='#download'>Install the Library</a> into your project using npm, this getting started guide will use the cli tool.    </div>  </div>  <div class='get_started__steps'>    <div class='get_started__step'>      <div class='get_started__step_number'>Step 1.</div>      <div class='get_started__step_text'>        install the konnekt cli tool using npm with the following command      </div>      <div class='get_started__step_code'>        <ide_code theme='light' code='{{step_1}}'></ide_code>      </div>    </div>  </div></div>";
get_started.prototype.k_css = "/********************************* *  get_started *  Created by keleko34 *  shows how to get started using the library ********************************/.get_started {  font-family: 'open sans';}.get_started__title {  text-align: center;  font-weight: 600;  color: #87cefa;  padding: 15px 0px;  font-size: 36px;}.get_started__types {  text-align: left;}.desktop .get_started__types {  width: 800px;  margin: 0 auto;}.mobile .get_started__types {  padding:10px 20px;}.get_started__types__text {  font-size: 14px;  font-weight: 500;  margin-bottom: 30px;}.desktop .get_started__types__text {  font-size: 14px;}.mobile .get_started__types__text {  font-size: 20px;  font-style: italic;}.get_started__types__text a.cli, get_started__types__text a.cli:active {  color:#84a2ea;  text-decoration: none;}.get_started__types__text a.lib, get_started__types__text a.lib:active {  color:#bc68d6;  text-decoration: none;}.desktop .get_started__steps {  width: 800px;  margin: 0 auto;}.mobile .get_started__steps {  padding: 0px 20px;}.get_started__step_number {  font-family: 'wolf_in_the_cityregular';  color: #87cefa;  font-size:76px;}.get_started__step_text {  font-weight: 300;  font-size: 16px;  margin-top: -10px;  margin-bottom: 20px;}.desktop .get_started__step_code {  width:400px;}.mobile .get_started__step_code {  width:100%;}";
	return get_started;
}());
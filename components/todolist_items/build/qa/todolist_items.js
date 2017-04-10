if(!K_Components) K_Components = {};
K_Components["todolist_items"] = (function(){
/*********************************
 *  todolist_items
 *  Created by keleko34
 *  an item that holds an input and controls for todos
 ********************************/

function todolist_items(node)
{
  var self = this;

  /* ATTRIBUTES */
  this.title = "";
  this.complete = false;
  this.hide = false;
  this.favorite = false;
  this.onComplete = function(){};
  this.onDelete = function(){};

  /* FILTERS */
  this.filters.isHidden = function(v)
  {
    return (v ? 'none' : 'inherit');
  }

  this.filters.statusBackground = function(v)
  {
    v = (typeof v === 'string' ? (v === 'true') : v);
    return (v ? '#5a8451' : '#FFF');
  }

  this.filters.statusColor = function(v)
  {
    v = (typeof v === 'string' ? (v === 'true') : v);
    return (v ? '#FFF' : '#888787');
  }

  this.filters.placecheck = function(v)
  {
    node.querySelector('input').checked = v;
    return v;
  }

  this.filters.activeFav = function(v)
  {
    return (v ? 'active' : '');
  }

  this.filters.prependDash = function(v)
  {
    return (v.length !== 0 ? '-'+v : v);
  }

  /* EVENTS */
  this.onClickComplete = function(e)
  {
    self.complete = this.checked;
    self.onComplete(self.complete);
  }

  this.onClickFavorite = function(e)
  {
    self.favorite = !self.favorite;
  }

  this.onClickDelete = function(e)
  {
    self.onDelete(self.title);
  }
}

/* PROTOTYPES */

todolist_items.prototype.k_html = "<!-- todolist_items Created by keleko34, an item that holds an input and controls for todos --><div class='todolist_items'>  <div class='todolist_items__complete'>    <input class='todolist_items__complete__checkbox' type='checkbox' value='{{complete | placecheck}}' onchange='{{onClickComplete}}' />  </div>  <div class='todolist_items__title'>{{title}}</div>  <div class='todolist_items__controls'>    <todobutton title='favorite' onclick='{{onClickFavorite}}'>      <img class='todolist_items__controls__icon' src='assets/img/icons/star{{favorite | activeFav,prependDash}}.svg' />    </todobutton>    <todobutton title='garbage' onclick='{{onClickDelete}}'>      <img class='todolist_items__controls__icon' src='assets/img/icons/garbage.svg' />    </todobutton>  </div></div>";
todolist_items.prototype.k_css = "/********************************* *  todolist_items *  Created by keleko34 *  an item that holds an input and controls todos ********************************/.{{local}} .todolist_items {  background:{{complete | statusBackground}};  position: relative;  border-top: 2px dashed #e9e9e9;  height: 30px;  margin: 0px 14px;  display:{{hide | isHidden}}}.{{local}} .todolist_items__title {  color:{{complete | statusColor}};  padding-left: 42px;  line-height: 30px;  font-family: sans-serif;  font-size: 16px;}.{{local}} .todolist_items__complete {  width: 14px;  height: 14px;  position: absolute;  left: 12px;  top: 7px;}.{{local}} .todolist_items__complete__checkbox {  width: 14px;  height: 14px;  margin: 0;  cursor:pointer;}.{{local}} .todolist_items__controls {  position: absolute;  right: 24px;  top: 6px;}.{{local}} .todolist_items__controls__icon {  width:18px;  height:18px;  cursor:pointer;}.{{local}} .todolist_items__controls .todobutton {  position: absolute;}.{{local}} .todolist_items__controls .todobutton[title='favorite'] {  right:8px;}";
return todolist_items;
}());

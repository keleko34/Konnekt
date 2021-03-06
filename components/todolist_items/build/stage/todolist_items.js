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
  
  /* the main title of the item, this is placed as text */
  this.title = "";
  
  /* whether or not the checkbox has been clicked */
  this.complete = false;
  
  /* whether this item should be displayed */
  this.hide = false;
  
  /* tells if favorite is active, updates svg to show yellow one */
  this.favorite = false;
  
  /* passed oncomplete method fired when checkbox is clicked */
  this.onComplete = function(){};
  
  /* oassed ondelete method fired when trashcan is clicked */
  this.onDelete = function(){};
  
  /* FILTERS */
  
  /* simple filter that changed display css style based on `hide` */
  this.filters.isHidden = function(v)
  {
    return (v ? 'none' : 'inherit');
  }
  
  /* filter that returns color based on `complete` for the item background */
  this.filters.statusBackground = function(v)
  {
    /* sometimes checkbox returns value as string, this will be fixed later */
    v = (typeof v === 'string' ? (v === 'true') : v);
    return (v ? '#5a8451' : '#FFF');
  }
  
  /* filter that returns color based on `complete` for the text color */
  this.filters.statusColor = function(v)
  {
     /* sometimes checkbox returns value as string, this will be fixed later */
    v = (typeof v === 'string' ? (v === 'true') : v);
    return (v ? '#FFF' : '#888787');
  }
  
  /* helps with checking the input when the value changes, will not be needed when input update is done */
  this.filters.placecheck = function(v)
  {
    node.querySelector('input').checked = (typeof v === 'string' ? (v === 'true') : !!v);
    return v;
  }
  
  /* changes css class based on `favorite` property */
  this.filters.activeFav = function(v)
  {
    return (v ? 'active' : '');
  }
  
  /* simple filter that prepends a `-` to a string if it is not empty, use for classnames etc */
  this.filters.prependDash = function(v)
  {
    return (v.length !== 0 ? '-'+v : v);
  }
  
  /* EVENTS */
  
  /* fires when checkbox is clicked */
  this.onClickComplete = function(e)
  {
    /* assign checked value */
    self.complete = this.checked;
    
    /* fire passed oncomplete method */
    self.onComplete(self.complete);
  }
  
  /* fires if favorite was clicked */
  this.onClickFavorite = function(e)
  {
    self.favorite = !self.favorite;
  }
  
  /* fires passed ondelete when trashcan is clicked */
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
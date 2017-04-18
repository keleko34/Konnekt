if(!K_Components) K_Components = {};
K_Components["todolist"] = (function(){
/*********************************
 *  todolist
 *  Created by keleko34
 *  the main list for the todo app
 ********************************/

function todolist(node)
{
  /* scope `this` for events to access data set */
  var self = this;
  
  /* ATTRIBUTES */
  
  /* where each added item is stored, when this changes based on items the html list of todolist_items will change */
  this.items = [];
  
  /* the amount of completed tasks */
  this.complete = 0;
  
  /* the total number of tasks */
  this.total = 0;
  
  /* current input text */
  this.text = "";
  
  /* ERRORS */
  
  /* whether to show an error or not */
  this.isError = false;
  
  /* the message for this error */
  this.error = "";
  
  /* EVENTS */
  
  /* each sort button fires this */
  this.onSort = function(sorter)
  {
    /* we want to distinguish the from the rest as they are always active */
    var sorts = ['Descending','Ascending'];
    
    /* loop through sorters array */
    for(var x=0,len=self.sorters.length;x<len;x++)
    {
      /* check if Descending or Ascending sort method, if not then say if this sorter has been clicked or not, reset all others */
      if(sorts.indexOf(sorter) === -1 && sorts.indexOf(self.sorters[x].title) === -1)
      {
        self.sorters[x].active = (self.sorters[x].title === sorter);
      }
      
      /* if Descending or Ascending was clicked, check between them which is active */
      else if(sorts.indexOf(sorter) !== -1 && sorts.indexOf(self.sorters[x].title) !== -1)
      {
        self.sorters[x].active = (self.sorters[x].title === sorter);
      }
    }
    
    /* this runs the main sorting method, You will find these attached to prototype at the bottom of the page, based on sorter text clicked */
    self[sorter](self.items);
  }
  
  /* this input keyup fires this */
  this.onAdd = function(e)
  {
    /* keycode that was clicked */
    var keyCode = (e.which || e.keyCode),
        
        /* a list of just the titles of the items */
        itemtitles = self.items.map(function(item){return item.title;});
    
    /* reset error so it will no longer show */
    self.isError = false;
    
    /* if the key pressed was 'enter' key */
    if(keyCode === 13)
    {
      /* check if entered text doesnt already exist in the list, if it does throw an error */
      if(itemtitles.indexOf(self.text) !== -1)
      {
        self.isError = true;
        self.error = "This already exists!";
      }
      
      /* if no error push new item into the items array */
      if(!self.isError)
      {
        /* these will be all passed properties to the todolist_items component */
        self.items.push({
          title:self.text,
          hide:false,
          complete:false,
          favorite:false,
          onComplete:self.onComplete,
          onDelete:self.onDelete
        });
        
        /* increment total */
        self.total += 1;
        
        /* reset input */
        self.text = "";
      }
    }
  }
  
  /* passed to each todolist_items component to fire when a checkbox is clicked */
  this.onComplete = function(v)
  {
    /* if checkbox is active we add one else we subtract one */
    self.complete += ((typeof v === 'string' ? (v === 'true') : !!v) ? 1 : -1);
  }
  
  /* passed to each todolist_items component to fire when the trashcan is clicked */
  this.onDelete = function(title)
  {
    /* get the index of this item */
    var id = self.items.map(function(item){return item.title;}).indexOf(title);
    
    /* if this item was completed, subtract complete */
    if((typeof self.items[id].complete === 'string' ? (self.items[id].complete === 'true') : !!self.items[id].complete)) self.complete -= 1;
    
    /* delete the item from the array, splice also works, del is just shorter */
    self.items.del(id);
    
    /* subtract from total # of todo tasks */
    self.total -= 1;
  }
  
  /* the sorting items, array with data that is used to create the sortitems looped components, onSort method is passed to be used when user clicks each item */
  this.sorters = [
    {title:'All',active:true,onSort:this.onSort},
    {title:'Todo',active:false,onSort:this.onSort},
    {title:'Completed',active:false,onSort:this.onSort},
    {title:'Favorites',active:false,onSort:this.onSort},
    {title:'Ascending',active:false,onSort:this.onSort},
    {title:'Descending',active:false,onSort:this.onSort}
  ];
  
  /* a simple filter to change the css so that the error is not shown when !isError */
  this.filters.toDisplay = function(v)
  {
    return (!v ? 'none' : 'inherit');
  }
}

/* PROTOTYPES */

/* runs when All sortitem is clicked, resets all hide to false */
todolist.prototype.All = function(items)
{
  for(var x=0,len=this.items.length;x<len;x++)
  {
    this.items[x].hide = false;
  }
}

/* runs when Ascending sortitem is clicked, sorts titles alphabetically */
todolist.prototype.Ascending = function(items)
{
  items.sort(function(a,b){
    return (a.title > b.title ? 1 : -1);
  });
}

/* runs when Descending sortitem is clicked, sorts titles alphabetically in reverse */
todolist.prototype.Descending = function(items)
{
  items.sort(function(a,b){
    return (a.title > b.title ? -1 : 1);
  });
}

/* runs when Todo sortitem is clicked, hides all completed items */
todolist.prototype.Todo = function(items)
{
  for(var x=0,len=this.items.length;x<len;x++)
  {
    this.items[x].hide = (!!(typeof this.items[x].complete === 'string' ? (this.items[x].complete === 'true') : !!this.items[x].complete));
  }
}

/* runs when Completed sortitem is clicked, hides all non completed items */
todolist.prototype.Completed = function(items)
{
  for(var x=0,len=this.items.length;x<len;x++)
  {
    this.items[x].hide = (!(typeof this.items[x].complete === 'string' ? (this.items[x].complete === 'true') : !!this.items[x].complete));
  }
}

/* runs when Favorites sortitem is clicked, hides all non favorited items */
todolist.prototype.Favorites = function(items)
{
  for(var x=0,len=this.items.length;x<len;x++)
  {
    this.items[x].hide = (!this.items[x].favorite);
  }
}
todolist.prototype.k_html = "<!-- todolist Created by keleko34, the main list for the todo app --><div class='todolist'>  <div class='todolist__bar'>    <div class='todolist__bar__status'>{{complete}}/{{total}} completed</div>    <div class='todolist__bar__sort'>{{for sorters loop sortitem}}</div>  </div>  <div class='todolist__add'>    <img class='todolist__add__icon' src='assets/img/icons/edit.svg' />    <input class='todolist__add__input' type='text' placeholder='What needs to be done?' value='{{text}}' onkeyup='{{onAdd}}' />    <div class='todolist__add__error'>{{error}}</div>  </div>  <div class='todolist__items'>{{for items loop todolist_items}}</div></div>";
todolist.prototype.k_css = "/********************************* *  todolist *  Created by keleko34 *  the main list for the todo app ********************************/.todolist {}.todolist__items {  overflow: auto;  height: 333px;}.todolist__bar {  height: 25px;  border-bottom: 2px solid #e9e9e9;  font-family: sans-serif;  color: #888787;  font-size: 14px;  margin-left: 10px;  margin-right: 10px;  position: relative;}.todolist__bar__status {  line-height: 25px;  margin-left: 10px;  position: absolute;  left:0px;}.todolist__bar__sort {  position: absolute;  right: 0px;}.todolist__bar__sort .Wrapper__sortitem {  float:left;  margin-right:3px;  margin-right: 15px;  line-height: 25px;}.todolist__add {  height: 40px;  position: relative;}.todolist__add__icon {  height: 24px;  position: absolute;  left: 19px;  top: 8px;}.todolist__add__input {  height: 40px;  width: calc(100% - 62px);  margin: 0px 10px;  padding: 0;  outline: transparent;  border: none;  padding-left: 42px;  line-height: 40px;  font-family: sans-serif;  font-size: 16px;  color: #B1A9A9;}.{{local}} .todolist__add__error {  position: absolute;  right: 15px;  top: 8px;  border: 2px solid #fb7f7f;  padding: 3px;  background: #ffdddd;  border-radius: 3px;  display:{{isError | toDisplay}}}";
return todolist;
}());
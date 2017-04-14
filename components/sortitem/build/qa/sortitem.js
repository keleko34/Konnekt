if(!K_Components) K_Components = {};
K_Components["sortitem"] = (function(){
/*********************************
 *  sortitem
 *  Created by keleko34
 *  a button used for sorting the list
 ********************************/

function sortitem()
{
  var self = this;
  
  /* ATTRIBUTES */
  
  /* passed html title binding */
  this.title = "";
  
  /* passed active item binding */
  this.active = false;
  
  /* passed onsort method to be used when clicked */
  this.onSort = function(){};
  
  /* toggles class based on this.active */
  this.filters.activeText = function(v)
  {
    return (v ? 'active' : 'inactive');
  }
  
  /* the actual click event */
  this.sortClick = function(e)
  {
    self.onSort(self.title);
  };
}

/* PROTOTYPES */

sortitem.prototype.k_html = "<!-- sortitem Created by keleko34, a button used for sorting the list --><div class='sortitem sortitem--{{active | activeText}}' onclick='{{sortClick}}'>{{title}}</div>";
sortitem.prototype.k_css = "/********************************* *  sortitem *  Created by keleko34 *  a button used for sorting the list ********************************/.{{loopid}} .sortitem {  cursor:pointer;}.{{loopid}} .sortitem--active {  color:#7db770;}";
return sortitem;
}());
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
  this.title = "";
  this.active = false;
  this.onSort = function(){};
  this.filters.activeText = function(v)
  {
    return (v ? 'active' : 'inactive');
  }
  this.sortClick = function(e)
  {
    self.onSort(self.title);
  };
}

/* PROTOTYPES */

sortitem.prototype.k_html = "<!-- sortitem Created by keleko34, a button used for sorting the list --><div class='sortitem sortitem--{{active | activeText}}' onclick='{{sortClick}}'>{{title}}</div>";
sortitem.prototype.k_css = "/********************************* *  sortitem *  Created by keleko34 *  a button used for sorting the list ********************************/.{{local}} .sortitem {  cursor:pointer;}.{{local}} .sortitem--active {  color:#7db770;}";
return sortitem;
}());
/*********************************
 *  webapp
 *  Created by keleko34
 *  The main entry point for the konnekt web app
 ********************************/

function webapp()
{
  /* ATTRIBUTES */
  this.page = "";
  
  this.listen('page',function(value){
    this.page = value;
    console.log(value);
  });
}

/* PROTOTYPES */

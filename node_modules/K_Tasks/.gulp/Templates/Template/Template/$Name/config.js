/* Note* Put all templating files into the 'Template' folder */

module.exports = {
  firstCommand:'$FirstCommand',
  destination:'$Destination',
  commands:{
    /* Place Your Commands here */

    /* Example Command
       <Name of command>:{
         //optional only if this prompt is run multiple times and all values must be kept
         store:'array',

         cmd:{ //the cmd shortcuts for this prompt
          short:"-<one to two chars to represent your command name>", //string
          long:"--<lowercase name of your command>" //string
         },
         prompt:{ //the prompt settings
           type:"<can be (input|list)>", //String
           message:"<the message that will be displayed>", //string

           //optional only if type === list
           choices:<Array or function returning array> //Function@Params: Object:Values from current prompts
         },

         //String or Function@Params: String:CurrentValue,Object:Values from current prompts
         action:<next command to perform or 'end' to end all prompting and run command>
       }
     */

    /* Build Prompts */
  },
  onFinished:function(responses){
    /* this method runs after Your template has been created and all responded values are passed in */
  }
}

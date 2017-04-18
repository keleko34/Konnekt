# Task Configs

### Main config

 - Base<br />
 __This holds the base folder structure for templates and where to look for files for each__
 
 - Tasks<br />
 __This holds all the individual task configs__
 
### Task configs

 - commands<br />
 __This holds all commands to be run when this task is ran__
 
 
### Command Structure

When you add a command to the `commands` property it should be structured as:

`<Name of the command>:{`<br />
   `cmd:{ *optional`<br />
      `short:<short cli command like '-a'>, *optional`<br />
      `long:<long cli command like '--author'>,`<br />
      `help:<help message to show when --options is called> *optional`<br />
   `},`<br />
   `prompt:{`<br />
      `type:<('input'|'confirm'|'list')>,`<br />
      `message:<message to user>,`<br />
      `choices:<(array['option']|function(){returns array['option']})>`<br />
   `},`<br />
   `action:<string for next command or 'end' or 'exit' (string|function(){returns string})>,`<br />
   `store:<('string'|'array')> *optional`<br />
 `}`<br />
 
 - Name of command<br />
 __This name is what will be used as a key when passed, as well as in create is used as the $(Name of command) for string replacement__
 
 - cmd<br />
 *Optional*<br />
 __cmd can only be used with store types of string, these commands get auto populated into the --options list when added__<br />
 *NOTE when something like a message is needed remember that mesages have spaces and must be wrapped in "Message" to escape spaces in the cli*
 
 - prompt<br />
 __prompt is all the settings for the prompt that will be shown to the user, if a cli command was given then this will not be shown__
 
   * type<br />
   *Default 'input'*<br />
   __input require user input, confirm is basic true or false input, list requires the choices property to use as this will be the choices the user sees__
 
   * choices<br />
   __choices can either be an array of predetermined 'strings' or a function that returns an array of strings__
   
 - action<br />
 *No Default*<br />
 __action is a string or a function that returns a string that says which 'Name of command' should be run next or if 'end' is specififed it ends the line of commands, if 'exit' is specified it exits the process__
 
 - store<br />
 *Default 'string'*<br />
 __store tells how to store the values in the values object, either 'string' which then stores Key value pair eg.('Name of command':value) or 'array' which specifies an array of multiple values due to the command being run multiple times eg. 'Name of command':[value1,value2,etc...]__
 
 - overwrite<br />
 __allows for overwriting the value prior to being set with a function__
 
 ### Mapping in Create task
 
 __String__
 
 Mapping in create task is relatively simple, every `$Name of command` will be replaced with whatever was entered by the user. File names may also have `$Name of command` in them as to have their names replaced when created.
 
 __Array__
 
 Mapping with arrays is slightly different and is only allowed inside the file content. You can either map individual values as `$Name of command[0]` or if You want a repeating effect You can specify: `$Name of command[x](string to replicate with $x as value)` this will take all the text within `()` and replicate it as many times as the length of the array and replace `$x` in the text with that array positions value. This is very useful when needing to create lists based on a users input.
 
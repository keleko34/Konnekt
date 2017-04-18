var base = require('./../../Base'),
    open = require('open');

module.exports = function()
{
    function Command(res)
    {
        //start server command and open web page automatically when test is ran
        process.argv = process.argv.concat(['server','-p',global.gulp.config.Tasks.Test.port,'-r',global.gulp.config.Tasks.Test.root]);
        global.gulp.tasks['Server']();
        open('http://localhost:'+global.gulp.config.Tasks.Test.port);

        setTimeout(function()
        { 
            console.log('Starting to test module:\033[36m',res.Component+"\033[37m using \033[36m"+res.Test+"\033[37m test");
            global.gulp.config.Tasks.Test.tests[res.Test](res);
        },50);
    }

    return base
    .task('Test')
    .command(Command)
    .call();
}
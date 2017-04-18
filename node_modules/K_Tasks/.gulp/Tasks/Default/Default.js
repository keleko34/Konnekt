var base = require('./../../Base');

module.exports = function()
{
    function Command(res)
    {
        global.gulp.tasks[res.Task]();
    }

    return base
    .task('Default')
    .command(Command)
    .call();
}
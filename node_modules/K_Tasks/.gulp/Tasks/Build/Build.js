var base = require('./../../Base');

module.exports = function()
{

    function Command(res)
    {
        console.log('\033[36mStarting build using:\033[37m',res.Build+" runtime");
        res.builder(res);
    }

    return base
    .task('Build')
    .command(Command)
    .call();
}

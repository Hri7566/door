const Command = require(__approot+'/lib/Command');

module.exports = new Command('test', `Usage: PREFIXtest`, 0, (msg, bot) => {
    return `Test! args: ${msg.args.join(' | ')}`;
}, 0, false);
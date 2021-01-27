const Command = require(__approot+'/lib/Command');

module.exports = new Command('unban', `Usage: PREFIXunban <id>`, 0, (msg, bot) => {
    if (!bot.checkId(msg.argcat)) {
        return `Not an _id.`;
    }
    bot.client.sendArray([{m:'unban', _id: msg.argcat}]);
    return `Unbanning _id "${msg.argcat}".`;
}, 0, true);
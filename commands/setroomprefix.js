const Command = require(__approot+'/lib/Command');

module.exports = new Command(['setroomprefix','setroomp'], `Usage: PREFIXsetroomprefix <prefix>`, 1, (msg, bot) => {
    bot.prefix = msg.args[1];
    return `Set prefix to '${bot.prefix}'.`;
}, 1, false);
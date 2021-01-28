const Command = require(__approot+'/lib/Command');

module.exports = new Command(['setrules','setrule','ruleset'], `Usage: PREFIXsetrules <rules>`, 1, (msg, bot) => {
    if (bot.mainframe.setRules(bot.room, msg.argcat)) {
        return `Rules set successfully.`;
    } else {
        return `Too long.`;
    }
}, 1, false);
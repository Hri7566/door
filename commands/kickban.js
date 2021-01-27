const Command = require(__approot+'/lib/Command');

module.exports = new Command(['kickban','kick'], `Usage: PREFIXkickban <time> <user>`, 2, (msg, bot) => {
    if (!bot.client.isOwner()) {
        bot.sendChat(`The crown is required to kickban.`);
    }
    let argcat2 = msg.argcat.substring(msg.args[1].length).trim();
    let user = bot.mainframe.findUser(argcat2);
    if (user.rank._id < msg.p.rank._id) {
        bot.kickban(argcat2, parseFloat(msg.args[1]));
    } else {
        return `You can not kickban someone with your rank or higher.`;
    }
}, 1, false);
const Command = require(__approot+'/lib/Command');

module.exports = new Command(['setrank', 'setr'], `Usage: PREFIXsetrank <user> <rank>`, 2, (msg, bot) => {
    let user = bot.mainframe.findUser(msg.args[1]);
    bot.mainframe.setRank(user, msg.args[2]);
    let rank = bot.mainframe.getRank(user, bot);
    return `${user.name}'s rank has successfully been set to '${rank.name}'.`;
}, 2, false);
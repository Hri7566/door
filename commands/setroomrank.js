const Command = require(__approot+'/lib/Command');

module.exports = new Command(['setroomrank', 'setrr'], `Usage: PREFIXsetroomrank <user> <room>`, 2, (msg, bot) => {
    let user = bot.mainframe.findUser(msg.args[1]);
    bot.mainframe.setRoomRank(user, msg.args[2], bot);
    let rank = bot.mainframe.getRank(user, bot);
    return `${user.name}'s rank has successfully been set to '${rank.name}'.`;
}, 1, false);
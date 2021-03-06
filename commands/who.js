const Logger = require(__approot+'/lib/Logger');
const Command = require(__approot+'/lib/Command');

module.exports = new Command('who', `Usage: PREFIXwho <user>`, 0, (msg, bot) => {
    let user;
    if (msg.args[1]) {
        user = bot.mainframe.findUser(msg.argcat);
    } else {
        user = bot.mainframe.findUser(msg.p._id);
    }
    if (typeof(user) !== 'undefined') {
        return `Name: ${user.name} | _id: ${user._id} | Color: ${user.color} | Rank: ${bot.mainframe.getRank(user, bot).name}`;
    } else {
        return `Could not find user (case sensitive). Try using part of their username or using their _id instead.`;
    }
}, 0, false);
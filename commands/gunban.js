const Command = require(__approot+'/lib/Command');

module.exports = new Command(['gunban','ungban'], `Usage: PREFIXgunban <player>`, 1, (msg, bot) => {
    let user = bot.mainframe.findUser(msg.argcat);
    if (typeof(user) !== 'undefined') {
        bot.ungban(user);
        return `Globally unbanned ${user.name} [${user._id}].`;
    } else {
        return `User not found.`;
    }
}, 2, true);
const Command = require(__approot+'/lib/Command');

module.exports = new Command('gban', `Usage: PREFIXgban <player>`, 1, (msg, bot) => {
    let user = bot.mainframe.findUser(msg.argcat);
    if (typeof(user) !== 'undefined') {
        bot.gban(user);
        return `Globally banned ${user.name} [${user._id}].`;
    } else {
        return `User not found.`;
    }
}, 2, true);
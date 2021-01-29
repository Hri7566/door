const Command = require(__approot+'/lib/Command');
const Database = require(__approot+'/lib/Database');

module.exports = new Command('rank', `Usage: PREFIXrank`, 0, (msg, bot) => {
    const user = bot.mainframe.findUser(msg.p._id);
    if (typeof(user) == 'undefined') return;
    if (typeof(user.rank) == 'undefined') return;
    if (typeof(user.flags) == 'undefined') user.flags = {watchlist: false, god: false};
    if (typeof(user.flags.god) == 'undefined') user.flags.god = false;

    Database.save();

    return `${msg.p.name}, your rank is: ${user.flags.god ? 'God' : msg.p.rank.name} | ID: ${msg.p.rank._id} | Room only: ${msg.p.rank.roomonly}`;
}, 0, false);

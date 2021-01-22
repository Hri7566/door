const Command = require(__approot+'/lib/Command');

module.exports = new Command('rank', `Usage: PREFIXrank`, 0, (msg, bot) => {
    return `${msg.p.name}, your rank is: ${msg.p.rank.name} | ID: ${msg.p.rank._id} | Room only: ${msg.p.rank.roomonly}`;
}, 0, false);
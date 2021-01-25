const Command = require(__approot+'/lib/Command');

module.exports = new Command(['getcrown','crown'], `Usage: PREFIXgetcrown`, 0, (msg, bot) => {
    bot.chown(msg.p._id);
    return `Giving ownership to ${msg.p.name}.`;
}, 2, false);
const Command = require(__approot+'/lib/Command');

module.exports = new Command(['getcrown','crown','givecrown'], `Usage: PREFIXgetcrown`, 0, (msg, bot) => {
    if (!bot.client.isOwner()) {
        bot.sendChat(`No crown to give.`);
        return;
    }
    bot.chown(msg.p._id);
    return `Giving ownership to ${msg.p.name}.`;
}, 2, false);
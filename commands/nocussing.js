const Command = require(__approot+'/lib/Command');

module.exports = new Command(['nocussing','cuss','cussing',"noc"], `Usage: PREFIXnoc`, 0, (msg, bot) => {
    if (!bot.client.isOwner()) {
        bot.sendChat(`Room settings can not be changed without the crown, but will be saved for later.`);
    }
    if (typeof(bot.client.channel.settings["no cussing"]) == 'undefined') return `Can't change no cussing.`;
    if (bot.client.channel.settings["no cussing"]) {
        bot.setRoomSettings({"no cussing": false});
        return `No cussing off.`;
    } else {
        bot.setRoomSettings({"no cussing": true});
        return `No cussing on.`;
    }
}, 1, false);
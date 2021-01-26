const Command = require(__approot+'/lib/Command');

module.exports = new Command(['pianolock','unlockpiano','piano'], `Usage: PREFIXpianolock`, 0, (msg, bot) => {
    if (!bot.client.isOwner()) {
        bot.sendChat(`Room settings can not be changed without the crown, but will be saved for later.`);
    }
    if (typeof(bot.client.channel.settings.crownsolo) == 'undefined') return `Can't change piano lock.`;
    if (bot.client.channel.settings.crownsolo) {
        bot.setRoomSettings({crownsolo: false});
        return `Piano unlocked.`;
    } else {
        bot.setRoomSettings({crownsolo: true});
        return `Piano locked.`;
    }
}, 1, false);
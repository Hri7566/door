const Command = require(__approot+'/lib/Command');

module.exports = new Command(['hidden','visible','hideroom','showroom'], `Usage: PREFIXhidden`, 0, (msg, bot) => {
    if (!bot.client.isOwner()) {
        bot.sendChat(`Room settings can not be changed without the crown, but will be saved for later.`);
    }
    if (typeof(bot.client.channel.settings.crownsolo) == 'undefined') return `Can't change the room visibility.`;
    if (!bot.client.channel.settings.visible) {
        bot.setRoomSettings({visible: true});
        return `Room visible.`;
    } else {
        bot.setRoomSettings({visible: false});
        return `Room hidden.`;
    }
}, 1, false);
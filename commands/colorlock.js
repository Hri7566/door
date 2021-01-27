const Command = require(__approot+'/lib/Command');

module.exports = new Command(['colorlock','clock'], `Usage: PREFIXcolorlock`, 0, (msg, bot) => {
    if (typeof(bot.roomColorLock) === 'undefined') return `Could not change color lock.`;
    if (bot.roomColorLock) {
        bot.roomColorLock = false;
        return `Background color unlocked.`;
    } else {
        bot.roomColorLock = true;
        return `Background color locked.`;
    }
}, 0, false);

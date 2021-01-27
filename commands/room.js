const Command = require(__approot+'/lib/Command');

//! change hidden to false
module.exports = new Command(['room','r'], `Usage: PREFIXroom <add/remove/change> <room>`, 2, (msg, bot) => {
    let cmd = msg.args[1].toLowerCase();
    let room = msg.argcat.substring(cmd.length).trim();
    switch (cmd) {
        case 'add':
            bot.mainframe.addRoom(bot, room);
            break;
        case 'remove':
            bot.mainframe.removeRoom(bot, room);
            break;
        case 'change':
        case 'move':
            bot.mainframe.changeRoom(bot, room);
            break;
    }
}, 2, true);


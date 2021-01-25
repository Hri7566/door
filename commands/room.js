const Command = require(__approot+'/lib/Command');

//! change hidden to false
module.exports = new Command(['room','r'], `Usage: PREFIXroom <add/remove/change> <room>`, 2, (msg, bot) => {
    let cmd = msg.args[1];
    let room = msg.argcat.substring(cmd.length).trim();
    switch (cmd) {
        case 'add':
            
            break;
        case 'remove':
            
            break;
        case 'change':

            break;
    }
}, 2, true);


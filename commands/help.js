const Command = require(__approot+'/lib/Command');

module.exports = new Command('help', `Usage: PREFIXhelp`, 0, (msg, bot) => {
    let ret = `Commands: `;
    Object.keys(bot.commandRegistry.register).forEach(id => {
        let cmd = bot.commandRegistry.register[id];
        if (!cmd.hidden) {
            if (msg.p.rank._id >= cmd.minrank) {
                ret += ` ${bot.prefix}${cmd.cmd[0]}, `;
            }
        }
    });
    ret = ret.substring(0, ret.length - 2);
    ret = ret.trim();
    return ret;
}, 0, false);
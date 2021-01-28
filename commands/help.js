const Command = require(__approot+'/lib/Command');
const Logger = require(__approot+'/lib/Logger');

module.exports = new Command('help', `Usage: PREFIXhelp <command>`, 0, (msg, bot) => {
    let ret;
    if (!msg.args[1]) {
        ret = `Commands: `;
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
    } else {
        Object.keys(bot.commandRegistry.register).forEach(id => {
            let cmd = bot.commandRegistry.register[id];
            cmd.cmd.forEach(c => {
                if (c === msg.args[1]) {
                    ret = Command.getUsage(cmd, bot.prefix);
                }
            });
        });
    }
    return ret;
}, 0, false);
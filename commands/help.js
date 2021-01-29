const Command = require(__approot+'/lib/Command');
const Logger = require(__approot+'/lib/Logger');

module.exports = new Command('help', `Usage: PREFIXhelp <command>`, 0, (msg, bot) => {
    let ret;
    let ch = " \u2502";
    if (!msg.args[1]) {
        ret = `Commands: `;
        Object.keys(bot.commandRegistry.register).forEach(id => {
            let cmd = bot.commandRegistry.register[id];
            if (!cmd.hidden) {
                if (msg.p.rank._id >= cmd.minrank) {
                    ret += ` ${bot.prefix}${cmd.cmd[0]}${ch} `;
                }
            }
        });
        ret = ret.substring(0, ret.trim().length - ch.trim().length);
        ret = ret.trim();
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

module.exports = class Command {
    constructor (cmd, usage, minargs, func, minrank, hidden) {
        typeof(cmd) === 'object' ?  this.cmd = cmd : this.cmd = [cmd];
        typeof(usage) === 'string' ? this.usage = usage : this.usage = `There is no help for '${cmd.cmd[0]}'.`;
        typeof(minargs) === 'number' ? this.minargs = minargs : this.minargs = 0;
        typeof(func) === 'function' ? this.func = func : this.func = (msg, bot) => {return `This command is broken.`};
        typeof(minrank) === 'number' ? this.minrank = minrank : this.minrank = 0;
        typeof(hidden) === 'boolean' ? this.hidden = hidden : this.hidden = false;
    }

    static getUsage(cmd, prefix) {
        return cmd.usage.split('PREFIX').join(prefix);
    }
}
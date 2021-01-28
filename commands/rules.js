const Command = require(__approot+'/lib/Command');

module.exports = new Command('rules', `Usage: PREFIXrules`, 0, (msg, bot) => {
    let rules = bot.getRules();
    if (typeof(rules) !== 'undefined') {
        return rules;
    } else {
        return `There are no rules set for this room.`;
    }
}, 0, false);
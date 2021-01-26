const Command = require(__approot+'/lib/Command');

module.exports = new Command('givemeram', `Usage: PREFIXgivemeram`, 0, (msg, bot) => {
    return "64GB of DDR4 RAM will be on your doorstep within three days. If you happen to see a dark web sales associate, DO NOT SHOOT THEM.";
}, 0, true);

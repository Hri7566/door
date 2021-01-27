const Command = require(__approot+'/lib/Command');
const Database = require(__approot+'/lib/Database');
const RankTypes = require(__approot+'/lib/RankTypes');

let blacklist = [
    "process",
    "os",
    "child_process",
    "blacklist"
]

module.exports = new Command('js', `Usage: PREFIXjs <javascript>`, 1, (msg, bot) => {
    let ret;
    let allowed = true;
    if (msg.p.rank._id < 3) {
        blacklist.forEach(term => {
            if (msg.argcat.includes(term)) {
                ret = `The term '${term}' is disallowed.`;
                allowed = false;
            }
        });
    }

    if (!allowed) return ret;

    try {
        let out = eval(msg.argcat);
        ret = `✔️ Console: ${out}`;
    } catch (err) {
        if (err) {
            ret = `❌ ${err}`;
        }
    }

    return ret;
}, 2, false);
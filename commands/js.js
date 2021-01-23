const Command = require(__approot+'/lib/Command');
const Database = require(__approot+'/lib/Database');

let blacklist = [
    "process",
    "os",
    "child_process"
]

module.exports = new Command('js', `Usage: PREFIXjs <javascript>`, 1, (msg, bot) => {
    let ret;
    let allowed = true;
    blacklist.forEach(term => {
        if (msg.argcat.includes(term)) {
            ret = `The term '${term}' is disallowed.`;
            allowed = false;
        }
    });

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
}, 3, false);
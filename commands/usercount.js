const Database = require(__approot+'/lib/Database');
const Command = require(__approot+'/lib/Command');

module.exports = new Command(['usercount','users'], `Usage: PREFIXusercount`, 0, (msg, bot) => {
    return `Users in Database: ${Object.keys(Database.db).length}`;
}, 0, false);
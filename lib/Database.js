const fs = require('fs');
const Logger = require(__approot+'/lib/Logger.js');

module.exports = class Database {
    static db = require(__approot+'/database.json');
    static rooms = require(__approot+'/rooms.json');
    static roomsettings = require(__approot+'/roomsettings.json');
    static rules = require(__approot+'/rules.json');

    static save() {
        // fs.writeFile(__approot+'/database.json', JSON.stringify(this.db, null, 4), (err) => {
        //     if (err) {
        //         Logger.error(err);
        //     }
        // });

        fs.writeFileSync(__approot+'/database.json', JSON.stringify(this.db, null, 4));
        fs.writeFileSync(__approot+'/rooms.json', JSON.stringify(this.rooms, null, 4));
        fs.writeFileSync(__approot+'/roomsettings.json', JSON.stringify(this.roomsettings, null, 4));
        fs.writeFileSync(__approot+'/rules.json', JSON.stringify(this.rules, null, 4));
    }
}
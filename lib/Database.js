const fs = require('fs');
const Logger = require(__approot+'/lib/Logger.js');

module.exports = class Database {
    static db = require(__approot+'/database.json');
    static rooms = require(__approot+'/rooms.json');

    static save() {
        fs.writeFile(__approot+'/database.json', JSON.stringify(this.db, null, 4), (err) => {
            if (err) {

            }
        });
    }
}
const MPPBot = require(__approot+'/mpp');
const Registry = require(__approot+'/lib/Registry');
const User = require(__approot+'/lib/User');
const Database = require(__approot+'/lib/Database');
const fs = require('fs');
const Logger = require(__approot+'/lib/Logger');
const Rank = require(__approot+'/lib/Rank');

module.exports = class Mainframe {
    constructor (mppbots) {
        this.mppbots = new Registry(mppbots);
        this.commands = {};
    }

    start() {
        this.loadCommands();
        Object.keys(Database.rooms).forEach(uri => {
            let rooms = Database.rooms[uri];
            rooms.forEach(room => {
                this.mppbots[uri+room] = new MPPBot(this, process.env.PREFIX, uri, room, this.commands);
                this.mppbots[uri+room].start();
            });
        });
    }

    loadCommands() {
        let files = fs.readdirSync(__approot+'/commands');
        if (typeof(files) === 'undefined') return;
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            let cmd = require(__approot+'/commands/'+file);
            if (typeof(cmd) === 'undefined') return;
            if (typeof(cmd.cmd) !== 'object') cmd.cmd = [cmd.cmd];
            this.commands[cmd.cmd[0]] = cmd;
        });
    }

    getUser(p) {
        if (typeof(p) === 'undefined') return;
        
        let ret;
        let found = false;
        Object.keys(Database.db).forEach(id => {
            let user = Database.db[id];
            if (p._id === user._id || p._id === id) {
                ret = user;
                found = true;
            }
        });

        if (found) {
            return ret;
        }
    }

    getRank(p) {
        return Rank.generate('');
    }

    genUser(p) {
        if (typeof(p) === 'undefined') return;

        if (typeof(this.getUser(p)) === 'undefined') {
            Database.db[p._id] = new User(p);
        }
    }
}
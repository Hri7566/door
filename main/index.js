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
                this.mppbots[uri+room] = new MPPBot(this, process.env.BOT_PREFIX, uri, room, this.commands);
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

    findUser(str) {
        let ret;
        Object.keys(Database.db).forEach(id => {
            let user = Database.db[id];
            if (id.includes(str) || user.name.includes(str) || user._id.includes(str)) {
                ret = user;
            }
        });
        return ret;
    }

    getRank(p, bot) {
        if (typeof(p) === 'undefined') return;
        let ret = Rank.generate('user', false);
        let user = this.getUser(p);
        let hasRank = true;
        let hasRoomRanks = true;
        if (typeof(user.rank) === 'undefined') hasRank = false;
        if (typeof(user.roomRanks) === 'undefined') hasRoomRanks = false;

        if (hasRank) {
            if (hasRoomRanks) {
                let roomrank;
                Object.keys(user.roomRanks).forEach(uriroom => {
                    if (uriroom == bot.uri+bot.room) {
                        roomrank = user.roomRanks[uriroom];
                    }
                });
                if (typeof(roomrank) === 'undefined') {
                    roomrank = Rank.generate('user', false);
                }
                if (roomrank._id > user.rank._id) {
                    ret = roomrank;
                } else {
                    ret = user.rank;
                }
            } else {
                ret = user.rank;
            }
        } else {
            if (hasRoomRanks) {
                Object.keys(user.roomRanks).forEach(uriroom => {
                    if (uriroom == bot.uri+bot.room) {
                        ret = user.roomRanks[uriroom];
                    }
                });
            }
        }

        return ret;
    }

    setRank(p, str) {
        let user = this.getUser(p);
        if (typeof(user) === 'undefined') return;
        user.rank = Rank.generate(str, false);
        Database.save();
    }

    setRoomRank(p, str, bot) {
        let user = this.getUser(p);
        if (typeof(user.roomRanks) === 'undefined') {
            user.roomRanks = {};
        }
        user.roomRanks[bot.uri+bot.room] = Rank.generate(str, true);
        Database.save();
    }

    genUser(p) {
        if (typeof(p) === 'undefined') return;

        if (typeof(this.getUser(p)) === 'undefined') {
            Database.db[p._id] = new User(p);
        }
        
        Database.save();
    }
}
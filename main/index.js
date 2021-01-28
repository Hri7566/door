const MPPBot = require(__approot+'/mpp');
const Registry = require(__approot+'/lib/Registry');
const User = require(__approot+'/lib/User');
const Database = require(__approot+'/lib/Database');
const fs = require('fs');
const Logger = require(__approot+'/lib/Logger');
const Rank = require(__approot+'/lib/Rank');

module.exports = class Mainframe {
    constructor (mppbots) {
        this.mppbots = {};
        this.commands = {};
        this.nextTime = 0;
    }

    start() {
        this.loadCommands();
        Object.keys(Database.rooms).forEach(uri => {
            let rooms = Database.rooms[uri];
            let delayAmount = 3000;
            let delay = 0;
            rooms.forEach(room => {
                delay += delayAmount;
                setTimeout(() => {
                    this.mppbots[`${uri}${room}`] = new MPPBot(this, process.env.BOT_PREFIX, uri, room, this.commands);
                    this.mppbots[`${uri}${room}`].start();
                }, delay);
            });
        });
    }

    checkFlag(p, flag) {
        let user = this.getUser(p);
        if (typeof(user) == 'undefined') return;
        if (typeof(user.flags) == 'undefined') user.flags = {watchlist: false};
        if (typeof(user.flags[flag]) == 'undefined') return false;
        return user.flags[flag];
    }

    addRoom(bot, room) {
        if (typeof(this.mppbots[`${bot.uri}${room}`]) !== 'undefined') return false;
        this.mppbots[`${bot.uri}${room}`] = new MPPBot(this, process.env.BOT_PREFIX, bot.uri, room, this.commands);
        Database.rooms[bot.uri].push(room);
        Database.save();
    }

    removeRoom(bot, room) {
        if (typeof(this.mppbots[`${bot.uri}${room}`]) !== 'undefined') {
            this.mppbots[`${bot.uri}${room}`] = undefined;
            Database.rooms[bot.uri][Database.rooms[bot.uri].indexOf(bot.room)] = undefined;
            Database.save();
        }
    }

    changeRoom(bot, room) {
        this.mppbots[`${bot.uri}${room}`] = this.mppbots[`${uri}${bot.room}`];
        this.mppbots[`${bot.uri}${bot.room}`] = undefined;
        bot.room = room;
        bot.client.setChannel(room);
        Database.rooms[bot.uri][Database.rooms[bot.uri].indexOf(bot.room)] = room;
    }

    broadcast(str) {
        Object.keys(this.mppbots).forEach(id => {
            let bot = this.mppbots[id];
            bot.sendChat(`Broadcast: ${str}`);
        });
    }

    getNextTime() {
        if (this.nextTime == 0) {
            setTimeout(() => {
                this.nextTime = 0;
            }, Object.keys(this.mppbots).length*3000);
        }
        this.nextTime += 3000;
        return this.nextTime;
    }

    getGlobalBans() {
        let ret = [];
        Object.keys(Database.db).forEach(id => {
            let user = Database.db[id];
            if (typeof(user.gbanned) === 'undefined') return;
            if (user.gbanned) {
                ret.push(user);
            }
        });
        return ret;
    }

    gban(user) {
        if (typeof(user.gbanned) == 'undefined') user.gbanned = true;
        if (user.gbanned == false) user.gbanned = true;
        Database.save();
        return true;
    }

    ungban(user) {
        if (typeof(user.gbanned) == 'undefined') user.gbanned = false;
        if (user.gbanned == true) user.gbanned = false;
        Database.save();
        return true;
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

    setRules(room, rulestr) {
        if (typeof(room) !== 'string') return;
        if (typeof(rulestr) !== 'string') return;
        if (rulestr.length > 512) return false;
        Database.rules[room] = rulestr;
        Database.save();
        return true;
    }

    getRules(room) {
        if (typeof(room) !== 'string') return;
        return Database.rules[room];
    }

    setRoomSettings(bot, settings) {
        Object.keys(settings).forEach(key => {
            let set = settings[key];
            if (typeof(set) === 'undefined') return;
            if (typeof(Database.roomsettings[bot.uri][bot.room]) == 'undefined') Database.roomsettings[bot.uri][bot.room] = {};
            Database.roomsettings[bot.uri][bot.room][key] = set;
        });
        Database.save();
    }

    getRoomSettings(bot) {
        return Database.roomsettings[bot.uri][bot.room];
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

        let user = this.getUser(p);

        if (typeof(user) === 'undefined') {
            Database.db[p._id] = new User(p);
            user = Database.db[p._id];
        }

        if (user.name !== p.name) {
            user.name = p.name;
        }
        
        Database.save();
    }
}
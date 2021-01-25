const Client = require(__approot+'/lib/Client');
const Command = require(__approot+'/lib/Command');
const Logger = require(__approot+'/lib/Logger');
const Registry = require(__approot+'/lib/Registry');

module.exports = class MPPBot {
    constructor (mainframe, prefix, uri, room, cmdData, proxy) {
        this.mainframe = mainframe;
        this.client = new Client(uri, proxy);
        this.room = room;
        this.logsChat = process.env.CHAT_LOG;
        this.uri = uri;
        this.chatStack = [];
        typeof(prefix) === 'string' ? this.prefix = prefix : this.prefix = ";";
        this.commandRegistry = new Registry(cmdData);
        this.votebans = {};
        this.votekicks = {};
        this.roomSetDelay = 5000;
        this.roomColorLock = false;
    }

    start() {
        this.client.start();
        this.client.setChannel(this.room);
        this.listen();
        this.startChat();
        this.startRoomSettingsInterval();
    }

    sendChat(str) {
        if (typeof(str) === 'undefined') return;
        // this.client.sendArray([{m:'a', message:`\u034f${str}`}]);
        if (this.chatStack.length < 4) {
            this.chatStack.push(str);
        } else {
            setTimeout(() => {
                this.chatStack.push(str);
            }, 1000);
        }
    }

    startChat() {
        this.chatInt = setInterval(() => {
            if (!(this.chatStack.length > 0)) return;
            if (this.chatStack.length < 4) {
                if (typeof(this.chatStack[0]) === 'undefined') return;
                this.client.sendArray([{m:'a', message: this.chatStack.reverse().pop()}]);
                //console.log(this.chatStack[0]);
                this.chatStack.splice(0, 1);
            } else {
                setTimeout(() => {
                    if (typeof(this.chatStack[0]) === 'undefined') return;
                    this.client.sendArray([{m:'a', message: this.chatStack.reverse().pop()}]);
                    //console.log(this.chatStack[0]);
                    this.chatStack.splice(0, 1);
                }, 1600);
            }
        });
    }

    getPart(str) {
        let ret;
        Object.keys(this.client.ppl).forEach(id => {
            let p = this.client.ppl[id];
            if (p.name.includes(str) || id.includes(str) || p._id.includes(str)) {
                ret = p;
            }
        });
        return ret;
    }

    startRoomSettingsInterval() {
        this.chsetInt = setInterval(() => {
            if (typeof(this.client.channel) === 'undefined') return;
            if (this.client.channel._id !== this.room) {
                this.client.setChannel(this.room);
            } else {
                let set = this.mainframe.getRoomSettings(this);
                this.client.sendArray([{m:'chset', set:set}]);
            }
        }, this.roomSetDelay);
    }

    chown(str) {
        let id = this.getPart(str).id;
        if (typeof(id) == 'undefined') return false;
        this.client.sendArray([{m:'chown', id:id}]);
        return true;
    }

    kickban(id, ms) {
        this.client.kickBan(id, ms);
    }

    votekick(p, id) {
        let ret;
        if (typeof(p) === 'undefined') return;
        if (typeof(id) === 'string') return;

        let kuser = this.mainframe.findUser(id);
        if (typeof(kuser) !== 'undefined') {
            if (typeof(this.votekicks[id]) === 'undefined') {
                this.votekicks[id] = {
                    expr: 60000,
                    votes: 1
                }

                setTimeout(() => {
                    delete this.votekicks[id];
                }, this.votekicks[id].expr);

                ret = `A votekick on ${kuser.name} has been started. You have 60 seconds to get ${Math.ceil(Object.keys(this.client.ppl)/2)-this.votekicks[id].votes} more votes in.`;
            } else {
                this.votekicks[id].votes++;
                ret = `${p.name} has voted to kick ${kuser.name}. ${Math.ceil(Object.keys(this.client.ppl)/2)-this.votekicks[id].votes} more votes are needed.`;
            }
        } else {
            ret = `Couldn't find user.`;
        }

        return ret;
    }

    setRoomSettings(settings) {
        this.client.sendArray([{m:'chset', set:settings}]);
        this.mainframe.setRoomSettings(this, settings);
    }

    listen() {
        let client = this.client;

        client.on('hi', () => {
            Logger.log(`Online on ${client.uri} in room ${this.room}`);
        });

        // client.on('participant added', p => {
        //     if (p._id == "06ff004e30d91d502a8effed") {
        //         client.chown(client.findParticipantById('06ff004e30d91d502a8effed').id);
        //     }
        // });

        client.on('a', msg => {
            let outmsg = this.handleMessage(msg);
            if (typeof(outmsg) !== 'undefined') {
                this.sendChat(outmsg);
            }

            if (this.logsChat == 'true') {
                Logger.log(`[${msg.p._id}] ${msg.p.name}: ${msg.a}`);
            }
        });

        client.on('participant added', p => {
            this.mainframe.genUser(p);
        });

        client.on('error', err => {
            if (err) {
                Logger.error(err);
                Logger.log(`MPP Client crashed`);
                Logger.log(`Rejoining...`);
                client.stop();
                client.start();
            }
        });

        client.on('notification', msg => {
            if (typeof(msg) == 'undefined') return;
            if (typeof(msg.text) == 'undefined') return;
            if (msg.text.includes('Banned from')) {
                client.setChannel(this.room);
            }
        });
    }

    handleMessage(msg) {
        msg.args = msg.a.split(' ');
        msg.cmd = msg.args[0].split(this.prefix).join('');
        msg.user = this.mainframe.getUser(msg.p);
        msg.argcat = msg.a.substring(this.prefix.length + msg.cmd.length, msg.a.length).trim();
        msg.p.rank = this.mainframe.getRank(msg.p, this);

        let ret;
        if (!msg.a.startsWith(this.prefix)) return;

        Object.keys(this.commandRegistry.register).forEach(id => {
            let cmd = this.commandRegistry.register[id];
            cmd.cmd.forEach(c => {
                if (msg.cmd == c) {
                    if (msg.p.rank._id >= cmd.minrank) {
                        if (msg.args.length - 1 >= cmd.minargs) {
                            ret = cmd.func(msg, this);
                        } else {
                            ret = `Not enough arguments. ${Command.getUsage(cmd, this.prefix)}`;
                        }
                    }
                }
            });
        });

        if (typeof(ret) !== 'undefined') {
            return ret;
        }
    }
}
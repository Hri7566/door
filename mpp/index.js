const Client = require('mpp-client-xt');
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
        typeof(prefix) === 'string' ? this.prefix = prefix : this.prefix = process.env.BOT_PREFIX;
        this.commandRegistry = new Registry(cmdData);
        this.votebans = {};
        this.votekicks = {};
    }

    start() {
        this.client.start();
        this.client.setChannel(this.room);
        this.listen();
    }

    sendChat(str) {
        if (typeof(str) === 'undefined') return;
        this.client.sendArray([{m:'a', message:`\u034f${str}`}]);
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
                Logger.error(`MPP Client crashed`);
                Logger.log(`Rejoining`);
                client.stop();
                client.start();
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
                            Logger.debug(ret);
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
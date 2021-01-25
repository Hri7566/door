const Logger = require(__approot+"/lib/Logger");

const RankTypes = require(__approot+'/lib/RankTypes');

module.exports = class Rank {
    constructor (name, ranktype, roomonly) {
        this.name = typeof(name) === 'string' ? name : 'User';
        this._id = typeof(ranktype) === 'number' ? ranktype : 0;
        this.roomonly = typeof(roomonly) === 'boolean' ? roomonly : true;
    }

    static generate(str, ronly) {
        if (typeof(ronly) !== 'boolean') ronly = true;
        switch (str) {
            case 'owner':
                return new this('Owner', RankTypes.OWNER, ronly);
                break;
            case 'admin':
                return new this('Administrator', RankTypes.ADMIN, ronly);
                break;
            case 'moderator':
            case 'mods':
            case 'mod':
                return new this('Moderator', RankTypes.MODERATOR, ronly);
                break;
            case 'ban':
            case 'banned':
                return new this('Banned', RankTypes.BANNED, ronly);
                break;
            default:
                return new this('User', RankTypes.USER, ronly);
                break;
        }
    }
}
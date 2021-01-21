const RankTypes = require(__approot+'/lib/RankTypes');

module.exports = class Rank {
    constructor (name, ranktype, roomonly) {
        typeof(name) === 'string' ? this.name = name : this.name = 'User';
        typeof(ranktype) === 'number' ? this._id = ranktype : this._id = 0;
        typeof(roomonly) === 'boolean' ? this.roomonly = roomonly : this.roomonly = true;
    }

    static generate(str) {
        switch (str) {
            case 'owner':
                return new this('Owner', RankTypes.OWNER);
                break;
            case 'admin':
                return new this('Administrator', RankTypes.ADMIN);
                break;
            case 'moderator':
            case 'mods':
            case 'mod':
                return new this('Moderator', RankTypes.MODERATOR);
                break;
            case 'ban':
            case 'banned':
                return new this('Banned', RankTypes.BANNED);
                break;
            default:
                return new this('User', RankTypes.USER);
                break;
        }
    }
}
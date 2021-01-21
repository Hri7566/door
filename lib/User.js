const Rank = require(__approot+'/lib/Rank');

module.exports = class User {
    constructor (p) {
        Object.keys(p).forEach(key => {
            this[key] = p[key];
        });

        if (typeof(this.x) !== 'undefined') delete this.x;
        if (typeof(this.y) !== 'undefined') delete this.y;
        if (typeof(this.id) !== 'undefined') delete this.id;
    }
}
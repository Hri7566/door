global.__approot = "..";
const User = require("./lib/User.js");
const toBan = require("./unmodified_bans.json");
const Database = require("./lib/Database.js");

toBan.forEach(id => {
    let user = Database.db[id];
    if (typeof(user) !== 'undefined') {
	user.gbanned = true;
        if (typeof(user.flags) == 'undefined') user.flags = {};
        user.flags.oldban = true;
    } else {
        user = new User({name:'Anonymous', _id:id, color:"#000000"});
        user.gbanned = true;
        user.flags.oldban = true;
        Database.db[id] = user;
    }
});

Database.save();


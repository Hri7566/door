const kickban = require("./kickban");

const Command = require(__approot+'/lib/Command');

// thank you, stackoverflow gods
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
}

let gunChoices = [
    0,
    0,
    0,
    0,
    0,
    1
]

let times = 0;

shuffle(gunChoices);

function reset() {
    times = 0;
    shuffle(gunChoices);
}

module.exports = new Command(['russianroulette','rur'], `Usage: PREFIXrussianroulette`, 0, (msg, bot) => {
    if (times > 5) {
        reset();
    }
    times++;
    let answer = `${msg.p.name}, you lived.`;
    if (gunChoices[times-1] == 1) {
        bot.kickban(msg.p._id, 60*60*1000);
        bot.unban(msg.p._id);
        answer = `${msg.p.name} died playing russian roulette.`;
        reset();
    }
    return answer;
}, 0, false);

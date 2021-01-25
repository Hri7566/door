const Color = require(__approot+'/lib/Color');
const Command = require(__approot+'/lib/Command');
const colorString = require('color-string');

module.exports = new Command(['roomcolor', 'color'], `Usage: PREFIXroomcolor <color1> <color2>`, 1, (msg, bot) => {
    if (!bot.client.isOwner()) {
        return `Room settings can not be changed without the crown.`;
    }
    let color;
    let color2;
    try {
        color = colorString.to.hex(colorString.get(msg.args[1]).value);
    } catch (err) {
        if (err) {
            console.log(err);
            return `"${msg.args[1]}" is not a valid color.`;
        }
    }
    if (msg.args[2]) {
        try {
            color2 = colorString.to.hex(colorString.get(msg.args[2]).value);
        } catch (err) {
            if (err) {
                return `"${msg.args[2]}" is not a valid color.`;
            }
        }
    }
    let c;
    if (typeof(color2) == 'undefined') {
        c = colorString.get(msg.args[1]);
        for (let i = 0; i < 3; i++) {
            c[i] -= 64;
        }
        color2 = colorString.to.hex(c.value);
    }
    bot.setRoomSettings({color: color, color2: typeof(color2) == 'undefined' ? color : color2});
    if (typeof(c) === 'undefined') {
        return `Set background color to ${color} [${Color.getNearestColor(color)}] with fade of ${color2} [${Color.getNearestColor(color2)}].`;
    } else {
        return `Set background color to ${color} [${Color.getNearestColor(color)}].`;

    }
}, 0, false);
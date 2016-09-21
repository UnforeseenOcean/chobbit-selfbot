const Command = require("../core/Command.js");
const Emoji = require("node-emoji").emoji;

name = "Test";
triggers = ["test", "testificate"];

run = function(Bot, msg) {
    return new Promise((resolve, reject) => {
        Bot.smartEdit(msg, `${Emoji.rose} A rose for you, my love.`);
        resolve(`${Emoji.rose} A rose for you, my love.`);
    });
}

module.exports = new Command(name, triggers, run);
const Command = require("../core/Command.js");
const Emoji = require("node-emoji").emoji;

const name = "Test";
const triggers = ["test", "testificate"];

const run = function(Bot, msg) {
    return new Promise((resolve, reject) => {
        Bot.smartEdit(msg, `${Emoji.rose} A rose for you, my love.`);
        resolve(`${Emoji.rose} A rose for you, my love.`);
    });
}

module.exports = new Command(name, triggers, run);
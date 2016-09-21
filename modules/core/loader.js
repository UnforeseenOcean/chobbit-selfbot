const Command = require("./Command.js");
const Emoji = require("node-emoji");
const emoji = Emoji.emoji;

const name = "Loader";
const description = "Handles loading, unloading and reloading commands from Discord"
const triggers = ["load", "reload", "unload"];
const usage = "<unload|reload|load> <(file)name>"

const success_emoji = emoji.ok_hand + Emoji.get('skin-tone-2');

var run = function(Bot, msg) {
    return new Promise((resolve, reject) => {
        if (msg.arguments.length < 1) reject('usage');
        if (msg.command === "load") { // Plain old load
            Bot.commandHandler.load(msg.arguments[0])
                .then((name) => { Bot.smartEdit(msg, `${success_emoji} Loaded command "${name}"`); resolve(); })
                .catch((err) => { Bot.errorEdit(msg, err); reject(err); });
        } else if (msg.command === "reload") { // Plain old reload
            Bot.commandHandler.reload(msg.arguments[0])
                .then((name) => { Bot.smartEdit(msg, `${success_emoji} Reloaded command "${name}"`); resolve(); })
                .catch((err) => { Bot.errorEdit(msg, err); reject(err); });
        } else if (msg.command === "unload") { // Plain ol' unload!
            Bot.commandHandler.unload(msg.arguments[0])
                .then((res) => { Bot.smartEdit(msg, `${success_emoji} Unloaded command "${res.name}"`); resolve(); })
                .catch((err) => { Bot.errorEdit(msg, err); reject(err); });
        }
    });
}

module.exports = new Command(name, triggers, run, description, usage);
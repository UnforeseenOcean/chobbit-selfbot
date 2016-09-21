const _ = require("underscore");
var exports = module.exports = {};

var cache = {};

exports.parse = function(Bot, msg, renew = false) {
    return new Promise((resolve, reject) => {
        if (!_.isObject(Bot) || !_.isObject(msg)) { throw new Error("Invalid arguments"); }

        if (_.has(cache, msg.content) && !renew) {
            let cached = cache[msg.content]; 
            resolve({cached: true, Bot: Bot, msg: cached, prefix: cached.prefix, command: cached.command, arguments: cached.arguments}); 
        }

        // We have to parse the prefix here sicne it was not passed in.
        if (!_.has(msg, 'prefix')) {
            var prefixes = Bot.config.get('discord.prefixes');

            for (let prefix of prefixes) {
                if (msg.content.substr(prefix.length) === prefix) {
                    msg.prefix = prefix;
                    msg.trimmed = msg.content.substr(prefix.length);
                    break;
                }
            }

            if (!_.has(msg, 'prefix')) { throw new Error("Cannot resolve prefix"); }
        }

        if (!_.has(msg, 'trimmed')) { throw new Error("Missing trimmed argument when prefix is present"); }

        // Resolve command
        if (!_.has(msg, 'command')) { 
            msg.command = msg.trimmed.split(' ')[0]; // Isolate command by splitting at first whitespace
            msg.trimmed = msg.trimmed.substr(msg.command.length + 1).trim(); // Remove whitespace after command and trim
         }

        var link_chars = Bot.config.get('parser.link_characters');

        if (!_.has(msg, 'arguments')) { msg.arguments = []; }

        var buffer = new String();
        var in_link = false;

        for (let char of msg.trimmed) {
            if (_.contains(link_chars, char)) {
                if (in_link) {
                    msg.arguments.push(buffer);
                    buffer = new String();
                }

                in_link = !in_link;
                continue;
            }

            if (char === " " && !in_link) {
                if (buffer.length > 0) msg.arguments.push(buffer);
                buffer = new String();
                continue;
            }

            buffer += char;
        }

        if (buffer.length > 0) msg.arguments.push(buffer);

        resolve({cached: false, Bot: Bot, msg: msg, prefix: msg.prefix, command: msg.command, arguments: msg.arguments});
    });
}
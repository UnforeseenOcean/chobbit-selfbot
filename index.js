/*
    chobbit-selfbot v. whatever
    this is mostly some spaghetti and meatballs
    if you do use this yourself, godspeed

    -- 2016-09-21 16:00 GMT+3, chobbit
*/

const Eris = require("eris");
const config = require("config");
const _ = require("underscore");
const MessageParser = require("./modules/core/message_parser.js");

console.info(`Starting chobbit-selfbot v.${config.get('app.version')}`);

var Bot = new Eris(config.get('discord.token'));
Bot.config = config; // For accessibility
Bot.messageParser = MessageParser;
Bot.timing = {};

Bot.on("ready", () => {
    console.info("Connected to Discord!");
    console.info(`| ${Date.now() - Bot.timing.conn_start}ms`);
});

Bot.on("messageCreate", (msg) => {
    if (_.contains(Bot.config.get('discord.authorized'), msg.author.id)) {
        var prefixes = Bot.config.get('discord.prefixes');

        for (let prefix of prefixes) {
            if (msg.content.substr(0, prefix.length) === prefix) {
                msg.prefix = prefix;
                msg.trimmed = msg.content.substr(prefix.length);
                break;
            }
        }

        if (_.has(msg, 'prefix')) {
            Bot.messageParser.parse(Bot, msg).then((parsed) => {
                console.log(parsed); // dev
            });
        }
    }

    return;
});

console.info("Connecting to Discord...");
Bot.timing.conn_start = Date.now();
Bot.connect();
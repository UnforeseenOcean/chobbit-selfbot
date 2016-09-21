/*
    chobbit-selfbot v. whatever
    this is mostly some spaghetti and meatballs
    if you do use this yourself, godspeed

    -- 2016-09-21 16:00 GMT+3, chobbit
*/

const Eris = require("eris");
const config = require("config");
const _ = require("underscore");
const Emoji = require("node-emoji").emoji;

const MessageParser = require("./modules/core/message_parser.js");
const CommandHandler = require("./modules/core/command_handler.js");

console.info(`Starting chobbit-selfbot v.${config.get('app.version')}`);

var Bot = new Eris(config.get('discord.token')); // Setup bot and custom stuff
Bot.config = config;
Bot.messageParser = MessageParser;
Bot.commandHandler = new CommandHandler(Bot, "../commands/");
Bot.timing = { timing_start: Date.now() };

// Because Discord sucks
Bot.smartEdit = function(msg, edit, delay=500) {
    setTimeout(() => Bot.editMessage(msg.channel.id, msg.id, edit), delay);
}

// Because retyping it every time sucks
Bot.errorEdit = function(msg, err) {
    setTimeout(() => Bot.editMessage(msg.channel.id, msg.id, `${Emoji.no_entry} Oops..` + "\n```\n" + err + "```"), 500);
}

Bot.commandHandler.load("../core/loader.js", true); // Core un-/re-/load command
Bot.commandHandler.crawl("modules/commands"); // Crawl command directory

Bot.on("ready", () => {
    console.info("Connected to Discord!");
    console.info(`| connecting: ${Date.now() - Bot.timing.conn_start}ms`);
});

Bot.on("messageCreate", msg => {
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
            Bot.messageParser.parse(Bot, msg).then(parsed => {
                // Note: does *not* work if command is not loaded (wowee Sherlock!)
                if (Bot.commandHandler.trigger_exists(parsed.command)) {
                    Bot.commandHandler.get_by_trigger(parsed.command)
                        .run(Bot, parsed.msg);
                }
            });
        }
    }

    return;
});

console.info(`| load: ${Date.now() - Bot.timing.timing_start}ms`);
console.info("Connecting to Discord...");
Bot.timing.conn_start = Date.now();

// reached 88 mph
Bot.connect();
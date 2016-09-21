const _ = require("underscore");
const Command = require("./Command.js");
const fs = require("mz/fs");

class CommandHandler {
    constructor(Bot, path) {
        this.loaded = {};
        this.triggers = {};

        this.path = path;
        this.bot = Bot;
    }

    is_loaded(name) {
        return _.has(this.loaded, name);
    }

    get_by_trigger(trigger) {
        if (_.has(this.triggers, trigger)) {
            return this.loaded[this.triggers[trigger]];
        } else {
            return null;
        }
    }

    trigger_exists(trigger) {
        return _.has(this.triggers, trigger);
    }

    load(file, full_path=false) {
        return new Promise((resolve, reject) => {
            if (!_.isString(file)) throw new Error("Invalid arguments");

            let path = full_path ? file : this.path + file;
            let temp = require(path);

            if (!(temp instanceof Command)) throw new Error("Not a command");
            if (this.is_loaded(temp.name)) throw new Error("Already loaded");

            for (let trigger of temp.triggers) {
                if (this.trigger_exists(trigger)) throw new Error("Trigger conflict!");
            }

            // Checks passed, actually register
            temp.path = path;
            this.loaded[temp.name] = temp;

            for (let trigger of temp.triggers) {
                this.triggers[trigger] = temp.name;
            }

            resolve(temp.name, this.loaded[temp.name]);
        });
    }

    unload(name, path=false) {
        return new Promise((resolve, reject) => {
            /*
                TODO:
                - check if valid arguments
                - check if actually loaded
                    - remove from require cache
                    - remove from this.loaded
                    - remove triggers
            */
            throw new Error("Not Implemented");
        });
    }

    reload(name, path=false) {
        return new Promise((resolve, reject) => {
            throw new Error("Not Implemented");
        });
    }

    crawl(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path).then(listing => {
                for (let filename of listing) {
                    this.load(filename)
                        .then((name) => console.info(`* Loaded command "${name}" (${filename})`));
                }
            });
        });
    }
}

module.exports = CommandHandler;
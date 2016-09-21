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
            if (!_.isString(file)) throw new Error("Invalid arguments (ch.load)");

            let path = full_path ? file : this.path + file;
            let temp = require(path);

            if (!(temp instanceof Command)) throw new Error("Not a command (ch.load)");
            if (this.is_loaded(temp.name)) throw new Error("Already loaded (ch.load)");

            for (let trigger of temp.triggers) {
                if (this.trigger_exists(trigger)) throw new Error("Trigger conflict! (ch.load)");
            }

            // Checks passed, actually register
            temp.path = path;
            this.loaded[temp.name] = temp;

            for (let trigger of temp.triggers) {
                this.triggers[trigger] = temp.name;
            }

            console.info(`* Loaded command "${temp.name}" (${temp.path})`);
            resolve(temp.name);
        });
    }

    unload(name) {
        return new Promise((resolve, reject) => {
            if (!_.isString(name)) throw new Error("Invalid arguments (ch.unload)");
            if (!this.is_loaded(name)) throw new Error("Not loaded (ch.unload)");

            let temp = this.loaded[name];
            let path = temp.path;

            console.info(`* Unloading command "${name}" (${temp.path})`);

            delete require.cache[require.resolve(temp.path)];
            delete this.loaded[name];
            
            for (let trigger of temp.triggers) {
                delete this.triggers[trigger];
            }

            resolve({name: name, path: path});
        });
    }

    reload(name) {
        return new Promise((resolve, reject) => {
            if (!this.is_loaded(name)) throw new Error("Not loaded (ch.reload)");

            console.info(`* Reloading command "${name}"`);

            this.unload(name)
                .then((res) => {
                    console.log(`Calling load with (${res.name} ${typeof res.name}) ${res.path} (${typeof res.path})`) // DEV
                    this.load(res.path).then((res) => {
                        resolve(res.name);
                    });
                });
        });
    }

    crawl(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path).then(listing => {
                for (let filename of listing) {
                    this.load(filename)
                }
            });

            resolve(this.loaded.length);
        });
    }
}

module.exports = CommandHandler;
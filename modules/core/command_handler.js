const _ = require("underscore");

class CommandHandler {
    constructor(Bot, path) {
        this.loaded = {};
        this.triggers = {};

        this.path = path;
        this.bot = Bot;
    }

    loaded(name) {
        return _.has(this.loaded, name);
    }

    triggers(trigger) {
        if (_.has(this.triggers, trigger)) {
            return this.triggers[trigger];
        } else {
            return null;
        }
    }

    trigger_exists(trigger) {
        return _.has(this.triggers, trigger);
    }

    load(file, full_path=false) {
        return new Promise((resolve, reject) => {
            throw new Error("Not Implemented");
        });
    }

    unload(name, path=false) {
        return new Promise((resolve, reject) => {
            throw new Error("Not Implemented");
        });
    }

    reload(name, path=false) {
        return new Promise((resolve, reject) => {
            throw new Error("Not Implemented");
        });
    }
}
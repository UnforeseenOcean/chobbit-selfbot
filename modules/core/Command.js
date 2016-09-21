const _ = require("underscore");

class Command {
    constructor(name, triggers, run, desc="No description", usage="") {
        if (!_.isString(name) || !_.isString(desc) || !_.isString(usage) || !_.isArray(triggers) || !_.isFunction(run)) {
            throw new Error("Invalid arguments");
        }

        this.name = name;
        this.desc = desc;
        this.description = description;
        this.triggers = triggers;
        this.run = run;
    }

    run(Bot, msg) {
        return new Promise((resolve, reject) => {
            this.run(Bot, msg)
                .then((ret) => { resolve(ret); })
                .catch((err) => { reject(err); });
        });
    }
}
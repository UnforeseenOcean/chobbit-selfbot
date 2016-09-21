const Command = require("../core/Command.js");
const _ = require("underscore");

const name = "Textfaces";
const triggers = ["tf", "textface"];

const faces = {
    "lenny": "( ͡° ͜ʖ ͡°)",
    "shrug": "¯\\\_(ツ)\_/¯",
    "gunz": "̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿",
    "lennyarmy": "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)",
    "pedobear": "ʕ•ᴥ•ʔ",
    "sniper": "▄︻̷̿┻̿═━一",
    "shades": "(▀̿Ĺ̯▀̿ ̿)",
    "fite": "(ง ͠° ͟ل͜ ͡°)ง",
    "disturbed": "ಠ\_ಠ",
    "gib": "༼ つ ◕\_◕ ༽つ",
    "gibawaii": "(づ｡◕‿‿◕｡)づ",
    "5bucks": "[̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]",
    "sparkles": "(ﾉ◕ヮ◕)ﾉ\*:･ﾟ✧ ✧ﾟ･: \*ヽ(◕ヮ◕ヽ)",
    "bricks": "┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴",
    "gunz2": "̿'̿'\̵͇̿̿\з=( ͠° ͟ʖ ͡°)=ε/̵͇̿̿/'̿̿ ̿ ̿ ̿ ̿ ̿",
    "fitesmall": "(ง'̀-'́)ง",
    "e": "(• ε •)",
    "lennynose": "(͡ ͡° ͜ つ ͡͡°)",
    "sobeautiful": "(ಥ﹏ಥ)",
    "chinaflip": "(ノಠ益ಠ)ノ彡┻━┻",
    "lennybucks": "[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]",
    "sparkle": "(ﾉ◕ヮ◕)ﾉ´\*:･ﾟ✧",
    "orly": "﴾͡๏̯͡๏﴿ O'RLY?",
    "disguy": "(☞ﾟ∀ﾟ)☞"
}

const run = function(Bot, msg) {
    return new Promise((resolve, reject) => {
        let face = new String();
        if (msg.arguments.length > 0) {
            if (msg.arguments[0] === "list") {
                face = `${_.sample(faces)} Available textfaces:` + "\n\n";
                for (let textface in faces) { face += ' `' + textface + '`'; }
            } else {
                if (msg.arguments.length > 1) {
                    for (let textface of msg.arguments) {
                        if (_.has(faces, textface)) { face += faces[textface] + ' '; }
                    }
                } else {
                    if (_.has(faces, msg.arguments[0])) { face = faces[msg.arguments[0]]; }
                    else { face = faces["shrug"] + " No such textface"; }
                }
            }
        } else {
            face = _.sample(faces);
        }

        Bot.smartEdit(msg, face, 150);
    });
}

module.exports = new Command(name, triggers, run);
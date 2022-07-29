console.logg = (...args) => console.log(args[0] + ' | ' + args.slice(1).join(' - '));

String.prototype.toName = function() {
    return require('path').basename(this.trim(), '.js');
}

console.logg("🔌", "Starting Bot...")
// .env file
require('dotenv').config()
// Discord.js
const { Intents } = require('discord.js');

// Initializing
module.exports.client = new (require('./classes/Bot'))({
    presence: {
        activities: [
            {
                type: "COMPETING",
                name: '.gg/crownfr'
            }
        ]
    },
    intents: Object.keys(Intents.FLAGS)
});
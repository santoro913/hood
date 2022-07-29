const { Message } = require('discord.js')
const Event = require('../classes/Event')
const Bot = require('../classes/Bot')
module.exports = new Event({
    path: __filename,
    aliases: ["message", "msg"],
    /**
     * @param {Bot} client 
     * @param {Message} message
     */
    run: async (client, message) => {
        client.loopFilesOf("./message/", async function (f) {
            try {
                if (f) await f.run({ client, message });
            } catch (err) { console.error(err); }
        });
    }
})
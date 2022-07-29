const { CommandInteraction } = require('discord.js')
const Event = require('../classes/Event')
const Bot = require('../classes/Bot')
const { readdirSync } = require('fs');
module.exports = new Event({
    path: __filename,
    aliases: ["interaction", "int", "intera"],
    /**
     * @param {Bot} client 
     * @param {CommandInteraction} int
     */
    run: async (client, int) => {
        for (let f of readdirSync('./interactions/')) {
            if (int[`is${f}`]()) {
                for (fileName of readdirSync(`./interactions/${f}/`)) {
                    fileName = fileName.split('.')[0]
                    require(`../interactions/${f}/${fileName}`).run({ client, int })
                        .catch(console.error)
                }
            }
        }
    }
})
const Discord = require('discord.js');
const Event = require('../classes/Event');
const Bot = require('../classes/Bot');

module.exports = new Event({
    path: __filename,
    type: 'once',
    aliases: [],
    /**
     * @param {Bot} client 
     */
    async run(client) {
        console.logg(`🤍`, `Connected as ${client.user.tag} !!`)
        client.loadSlashs()
        client.putSlashs();
        client.loadTimers();
        client.loadIntervals();
    }
})
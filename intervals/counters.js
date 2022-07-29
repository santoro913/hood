const { Client } = require("discord.js")

module.exports = {
    path: __filename,
    delay: 1000 * 60 * 10,
    /**
     * @param {Client} client 
     */
    async run(client) {
        console.log('Ceci se répéte toutes les 1000 * 60 * 10 millisecondes (60 secondes * 10 sois 10 minutes)');
    }
}
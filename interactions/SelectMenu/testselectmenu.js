const Discord = require("discord.js");
const Bot = require('../../classes/Bot');;

/**
 * @param {Bot} client 
 * @param {Discord.Interaction} int 
 */
module.exports.run = async ({ client, int }) => {
    if (int.customId !== "testselectmenu") return;
    return await int.reply(`You selected ${int.values.map(v => `\`${v}\``).join(' & ')}`);
}
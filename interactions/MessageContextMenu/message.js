const Discord = require('discord.js');
const Bot = require('../classes/Bot');
/**
 * @param {Bot} client 
 * @param {Discord.Message} message 
 * @returns 

 */

module.exports.run = async function ({ client, message }) {
    if (message.system
        || message.author.bot
        || message.channel.type === "DM"
        || !message.content.startsWith(client.prefix)) return;
    let messArray = message.content.trim().split(" ")
    let command = messArray[0].slice(client.prefix.length)
    let args = messArray.slice(1)
    let cmd = client.commands.get(command) || client.commands.find(c => c.aliases.includes(command));
    let id = message.author.id;
    if (!cmd) return;
    try {
        console.logg(`💬`, message.author.tag, message.cleanContent)
        if (!client.isDev(message.author.id)) {
            if (cmd.priv) return;

            if (client.cooldowns.has(id)) return await message.reply(":x: Wait a little bit before re-using this command !");
            client.cooldowns.add(id);
            setTimeout(() => client.cooldowns.delete(id), cmd.cooldown);
        }

        if (cmd.args.length && !args.length)
            return await message.reply(':x: You must provide arguments after using the command.')

        try {
            await cmd.run({ client, message, args });
        } catch (err) {
            console.error(err);
            if (client.isDev(message.author))
                return await message.reply(`:x: ${err.message || err.toString() || 'Une erreure est apparue!'}`)
            await message.reply(":x: An error has been detected when running the command ! D:");
        }
    } catch (err) {
        console.error(err)
    }
}
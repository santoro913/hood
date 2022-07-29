const Discord = require('discord.js');
const Command = require('../classes/Command')
const Bot = require('../classes/Bot')
module.exports = new Command({
    path: __filename,
    aliases: ["r"],
    priv: true,
    /**
     * @param {{ client : Bot, message : Discord.Message, args : string[]}}
     */
    async run({ client, message, args }) {
        let cmd = client.commands.find(c => c.name === args[0]) || client.commands.find(c => c.aliases.includes(args[0]))
        if (!cmd) return await message.reply(":x: No command with name or alias **" + args[0] + "** found.");
        delete require.cache[cmd.path];
        client.commands.set(cmd.name,require(cmd.path));
        return await message.reply(`:white_check_mark: Command **${cmd.name}** reloaded.`);
    }
})
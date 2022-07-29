const Discord = require('discord.js');
const Command = require('../classes/Command')
const Bot = require('../classes/Bot')
module.exports = new Command({
    path: __filename,
    aliases: ["h"],
    /**
     * @param {{ client : Bot, message : Discord.Message, args : string[]}}
     */
    async run({ client, message, args }) {
        if (!args[0]) {
            let n = 0;
            const embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setDescription(`\`\`\`md\n${client.commands.map((c) => `${++n}. ${c.name} - ${c.priv ? "🔐 " : c.description}`).join("\n")}\n\`\`\``)
            return await message.reply({ embeds: [embed] });
        } else {
            let cmdName = args[0]
            let cmd = client.commands.find(c => c.name === cmdName) || client.commands.find(c => c.aliases.includes(cmdName))
            if (!cmd) return await message.reply(":x: No command with name or alias **" + cmdName + "** found.");
            if (cmd.priv) return await message.reply(":x: This command is private.");
            const embed = new Discord.MessageEmbed()
                .setColor(client.color)
                .setTitle(`Commande : ${cmd.name}`)
                .setDescription(`\`\`\`md\n`
                    + `Description ${cmd.description}\n`
                    + `Aliases: ${cmd.aliases.join(' | ')}\n`
                    + `Cooldown: ${cmd.cooldown / 1e3}s\`\`\``);
            return await message.reply({ embeds: [embed] });
        }
    }
})
const Discord = require('discord.js');
const Command = require('../classes/Command')
const Bot = require('../classes/Bot')
module.exports = new Command({
    path: __filename,
    aliases: ["e"],
    priv: true,
    /**
     * @param {{ client : Bot, message : Discord.Message, args : string[]}}
     */
    async run({ client, message, args }) {
        try {
            const code = args.join(" ");
            let evaled = await eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled)

            return await message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`\`\`\`js\n${evaled.slice(0, 4000)}\n\`\`\``)
                ]
            })

        } catch (err) {
            return await message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`\`\`\`js\n${(err.stack || err.message || err.toString()).slice(0, 4000)}\n\`\`\``)
                ]
            })
        }


    }
})
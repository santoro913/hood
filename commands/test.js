const Discord = require('discord.js');
const Command = require('../classes/Command')
const Bot = require('../classes/Bot')
module.exports = new Command({
    priv : true,
    path: __filename,
    aliases: ["t"],
    /**
     * @param {{ client : Bot, message : Discord.Message, args : string[]}}
     */
    async run({ client, message, args }) {
        const select_menu = new Discord.MessageSelectMenu()
        .setCustomId("testselectmenu")
        .setPlaceholder("Selectionnez des elements")
        .setMaxValues(6)
        .setOptions([
            {
                label : "1",
                value: "premier"
            },
            {
                label: "2",
                value: "deuxieme"
            },
            {
                label: "3",
                value: "troisieme"
            },
            {
                label: "4",
                value: "quatrieme"
            },
            {
                label: "5",
                value: "cinquieme"
            },
            {
                label: "6",
                value: "sixieme"
            }
        ]);
        return await message.reply({
            components : [
                new Discord.MessageActionRow().setComponents(select_menu)
            ]
        })
    }
});
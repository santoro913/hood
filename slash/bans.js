const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Bot = require('../classes/Bot')

module.exports = new Slash({
    priv : true,
    path: __filename,
    data: {
        description: "Get a list of every ban of the server."
    },
    /**
     * @param {{
     *   client : Bot,
     *   int : Discord.BaseCommandInteraction,
     *   options : Discord.CommandInteractionOptionResolver,
     *   sub : string
     * }} param0
     */
    run: async ({ client, int, options, sub }) => {
        await int.deferReply();
        return await int.guild.bans.fetch()
            .then(bans => {
                if (!bans.size) return int.reply('No one is banned on this server yet.')
                let n = 0;
                 int.editReply(`La liste des bannis du serveur: \`\`\`md\n`
                    + bans.map(ban => `${++n}. <@${ban.user.id}> - ${ban.reason}`).join('\n')
                    + `\n\`\`\``);
            })
            .catch(err => {
                if (err.message == "Missing Permissions") return int.reply(":x: I cannot access this server's banned members")
                else console.log(err);
            })
    }
})
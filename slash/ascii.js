const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Paimon = require('../classes/Bot')
const figlet = require('figlet')


module.exports = new Slash({
    priv : true,
    path : __filename,
    data : {
        description : 'Transform text into ascii art',
        options : [
            {
                type : 'STRING',
                name : 'text',
                description : "The text you want to transform into ASCII format",
                required : true
            }
        ]
    },
    /**
     * @param {{
     *   client : Paimon,
     *   int : Discord.BaseCommandInteraction,
     *   options : Discord.CommandInteractionOptionResolver,
     *   sub : string
     * })
     */
    run: async ({ client, int, options, sub }) => {
        figlet(options.getString('text'), async (err, data) => {
            if (err) return int.reply(":x: " + err.message);
            if(data.length > 1950) return int.reply(':x: Text trop long.');
            await int.reply(`\`\`\`\n${data}\n\`\`\``)
        });
    }
})
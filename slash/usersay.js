const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Paimon = require('../classes/Bot')

module.exports = new Slash({
    priv: true, 
    path : __filename,
    data : {
        description : 'Force a user to speak',
        options : [
            {
                type : 'USER',
                name : 'user',
                description : "Force the user to speak",
                required : true
            },
            {
                type : 'STRING',
                name : 'text',
                description : "Quoi dire",
                required : true
            }
        ]
    },
    run: async ({ client, int, options }) => {
        let user = options.getUser('user')
        let text = options.getString('text')
        let webhooks = await int.channel.fetchWebhooks()
        let webhook = await webhooks.first()?.edit({
            name: user.username,
            avatar: user.displayAvatarURL(),
            channel: int.channel.id
        }) || await int.channel.createWebhook(user.username, {
            avatar: user.displayAvatarURL()
        });
        return await webhook.send(text);
    }
})
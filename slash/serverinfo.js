const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Paimon = require('../classes/Bot')
const Dispage = require('dispage');
module.exports = new Slash({
    path: __filename,
    data: {
        description: 'Get informations about this server.'
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
        const s = int.guild;
        const embed1 = new Discord.MessageEmbed()
            .setColor(client.color)
            .setTitle('General')
            .setImage(s.bannerURL({ dynamic : true, size : 4096}))
            .setThumbnail(s.iconURL({ dynamic : true, size : 4096}))
            .addFields(
                { name: 'Owner'             , value: s.members.cache.get(s.ownerId).user.tag },
                { name: 'Name'              , value: s.name },
                { name: 'ID'                , value: s.id },
                { name: 'Nsfw Level'        , value: s.nsfwLevel },
                { name: 'Verified'          , value: s.verified ? "Oui" : "Non" },
                { name: 'Verification Level', value: s.verificationLevel },
                { name: 'Features'          , value: s.features.join('\n') },
                { name: 'Vanity URL Code'   , value: s.vanityURLCode || "Aucun" },
                { name: 'Boosts'            , value: s.premiumSubscriptionCount+"" }
            );
        if (s.description) embed1.setDescription(s.description)

        const [bots,humans] = [
    s.members.cache.filter(m => m.user.bot),
    s.members.cache.filter(m => !m.user.bot)
    ].map(e => e.size)

        const embed2 = new Discord.MessageEmbed()
        .setTitle('Stats')
        .setColor(client.color)
        .addFields(
            { name : 'Members', value : 'Humans: '+humans+'\nBots: '+bots},
            { name : 'Stickers',value : ""+s.stickers.cache.size},
            ...[
              ["emojis","Emojis"],
              ["channels","Salons"],
              ["roles","Roles"]
            ].map(p=> ({ name: p[1],  value: ""+s[p[0]].cache.size })
        ));

        new Dispage(client)
        .setEmbeds([embed1,embed2])
        .start(int);
    }
})
const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Bot = require('../classes/Bot')

module.exports = new Slash({
    priv : true,
    path: __filename,
    data: {
        description: "Poster le reglement du serveur !",
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

        let rules = `𝐀𝐫𝐭𝐢𝐜𝐥𝐞 𝐈 - Les règles général du Discord

1 • La photo de profil ne doit pas contenir d'image à caractère sexuel, raciste,sexiste...
2 • Le pseudo ne doit pas contenir de caractère sexuel, raciste, sexiste...
3 • Ne pas mettre n'importe quoi lors d'une suggestion

𝐀𝐫𝐭𝐢𝐜𝐥𝐞 𝐈𝐈 - Les règles dans les salons textuels

1 • Tout sujet polémique est interdit. (~religion, politique...)
2 • Pas de lien vers des sites douteux/inconnus.
3 • Pas de propos raciste, homophobe, sexiste...
4 • Toute sorte d'harcèlement est prohibé.
5 • Le spam est formellement interdit.
6 • Les commandes ne peuvent s'effectuer que dans le salon commande prévu pour ça.
7 • Le ghost-ping (mentionner un individu ou un groupe d’individus et supprimer le message dans l’optique de perturber ces derniers)est interdit.
8 • Tout abus de provocation comme des insultes à répétition, des remarques déplacées sans que cela soit de l'humour est formellement interdit.

𝐀𝐫𝐭𝐢𝐜𝐥𝐞 𝐈𝐈𝐈 - Les règles dans les salons vocaux

1 • Le spam est formellement interdit. (~soundboard...)
2 • Pas de propos raciste, homophobe, sexiste...
3 • Tout abus de provocation comme des insultes à répétition, des remarques déplacées sans que cela soit de l'humour est formellement interdit.

𝐀𝐫𝐭𝐢𝐜𝐥𝐞 𝐈𝐕 - Les publicités

1 • La pub Mp est interdite.
2 • Votre serveur doit respecter lesTOS
3 • Les pub NSFW sont interdites.
4 • Votre publicité doit avoir une description.
5 • Vous devez respecter les salons dédié à la publicité.`.trim()

let embed = new Discord.MessageEmbed()
.setColor(client.color)
.setTitle('Règlement')
.setThumbnail(int.guild.iconURL({ dynamic : true, size: 4096 }))
.setDescription(rules)
.setImage("https://media.discordapp.net/attachments/1002604515448598570/1002701319863279706/rules.png")
let button = new Discord.MessageButton()
    .setLabel("J'accepte le reglement", setEmoji("1002898287159935048>"))
    .setStyle('SUCCESS')
    .setCustomId('verify');
let row = new Discord.MessageActionRow()
    .setComponents(button)
await int.channel.send({ embeds : [embed], components: [row] });
return await int.reply({ ephemeral: true, content: 'Message posté' })
    }
})
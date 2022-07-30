const { ModalSubmitInteraction } = require('discord.js');
const Paimon = require('../../classes/Bot');
const Discord = require('discord.js')
/**
 * @param {{ client: Paimon, int: ModalSubmitInteraction }} param0 
 */
module.exports.run = async ({ client, int }) => {
    if (int.customId !== 'report') return;

    let [type, text] = ["type", "text"].map(n => int.fields.getTextInputValue(n));

    let user = int.user;
    let guild = int.guild;
    let channel = int.channel;

    const embed = new Discord.MessageEmbed()
        .setColor(client.color)
        .setTitle("New report !")
        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic : true }) })
        .setThumbnail(int.user.displayAvatarURL({ dynamic : true }))
        .addField("Server", `${guild.name}\n(${guild.id})`, true)
        .addField("Channel", `${channel}\n${channel.name}\n(${channel.id})`, true)
        .addField("User", `${user}\n${user.tag}\n(${user.id})`, true)

    if (type) embed.addField("Type", type, true);
    if (text) embed.addField("Text", text, true);

    await client.channels.cache.get("1003024046704828447").send({
        content: client.owner.toString(),
        embeds: [embed]
    });


    await int.reply({
        ephemeral: true,
        content: "Thank you so much for your feedback ! My developper will look into your message and will give you updates <:02heart:937647877004615710>"
    });

}

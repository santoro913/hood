const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Paimon = require('../classes/Bot')

module.exports = new Slash({
    priv : true,
    path : __filename,
	data : {
		description : "Create a completely personnalized embed within one command ! :D",
		options : [
			{
				name : 'description',
				type : 'STRING',
				description : 'The description of the embed',
				required : true
			},
			{
				name : 'content',
				type : 'STRING',
				description : 'The content of the message that will contain the embed'
			},
			{
				name : 'title',
				type : 'STRING',
				description : 'The title of the embed',
			},
			{
				name : 'color',
				type : 'STRING',
				description : 'The color of the embed (by default is the color I always use)',
				choices : Object.keys(Discord.Constants.Colors)
				.filter(c => c.includes('_'))
				.map(color => ({ name : color.toUpperCase(), value : color }) )
			},
			{
				name : 'channel',
				type : 'CHANNEL',
				description : 'Where to send the embed ? (Only select a channel where you can send an embed link)',
				channelTypes : [
					'GUILD_NEWS',
					'GUILD_NEWS_THREAD',
					'GUILD_PRIVATE_THREAD',
					'GUILD_TEXT',
				]
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
		let color = options.getString('color')
		let desc = options.getString('description')
		let embed = new Discord.MessageEmbed(int)
		        .setColor(Number(color) || color || client.color)
		let title = options.getString("title");
		let channel = options.getChannel("channel") || int.channel;

		if(title) embed.setTitle(title)
		if(desc) embed.setDescription(desc)

		function getRow(d){
			return new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
				.setCustomId('send')
				.setLabel('Send')
				.setStyle("SUCCESS")
				.setDisabled(d ?? false),
				new Discord.MessageButton()
			    .setCustomId('cancel')
				.setLabel("Cancel")
				.setStyle("SECONDARY")
				.setDisabled(d ?? false)
			);
		}

		int.reply({ embeds : [embed], components : [getRow(false)] })
		.catch(err => int.reply(":x: "+err.message))
		.then(() => {
				const collector = int.channel.createMessageComponentCollector({
					max: 1,
					time: 30 * 1000,
					filter: i => i.isButton() && !i.deferred
				});

				collector.on('collect', (i) => {
					int.deleteReply();
					if(!["GUILD_TEXT","GUILD_NEWS"].some(c => channel.type == c))
					    return int.channel.reply(':x: I cannot send messages on none-text channels')
					if (i.customId === 'send') {
						if (!['EMBED_LINKS','SEND_MESSAGES'].every(i => int.member.permissionsIn(channel.id).has(i)))
							return int.channel.reply(":x: Permissions insuffisantes.");
						return channel.send({
							embeds: [embed],
							ephemeral: options.getBoolean("ephemeral")
						});
					}
				});
				collector.on('end',() => int.editReply({
					embeds : [embed], 
					components : [getRow(true)]
				}).catch(() => 0))
			})
		}
	})
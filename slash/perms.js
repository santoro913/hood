const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Bot = require('../classes/Bot')

module.exports = new Slash({
	priv : true,
    path : __filename,
	data : {
	  	description : "Get the permissions of a member in the server or even in a specific channel !",
		options : [
			{
				name : 'member',
				type : 'USER',
			    description : 'Who?',
				required : true
			},
			{
				name : 'channel',
				type : 'CHANNEL',
			    description : 'Where?'
			},
		]
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
        // Member
        const member = options.getMember('member');
        if(!member) return int.reply(':x: No member given.');
        if(!int.guild.members.cache.has(member.id)) return int.reply(':x: Given member is not on this server.')
        // Channel
        const channel = options.getChannel('channel');
        // Permissions
        let flags = member.permissions
        if(channel) flags = member.permissionsIn(channel.id)
		flags = flags.toArray();
        // ALL permissions
        const allFlags = Object.keys(Discord.Permissions.FLAGS)
        // .map
		const tag = `**${member.user.tag}**`;
        const list = flag => `${flags.includes(flag) ? client.e.yes : client.e.no} ${flag.title()}`;
        if(int.guild.ownerId == member.id) return int.reply(`✅ ${tag} is the owner of the server. Therefore has all the permissions and can control everyone in the server including himself.`)
        if(flags.includes('ADMINISTRATOR')) return int.reply(`✅ ${tag} is an administrator. They have all the permissions and can control everyone but the owner and members placed higher in the role hierarchy.`)
        const embed = new Discord.MessageEmbed()
        .setTitle(`Permissions of ${member.user.tag}${channel ? ` in #${channel.name}` : ''}`)
        .setDescription(`\`\`\`md\n${nallFlags.map(list).join('\n')}\n\`\`\``)
        int.reply({ embeds : [embed], ephemeral : true });
    }
})

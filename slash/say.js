const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Bot = require('../classes/Bot')

module.exports = new Slash({
    priv: true,
	path: __filename,
	dm: true,
	data: {
		description: "I'll say something!",
		options: [
			{
				name: 'text',
				type: 'STRING',
				description: 'What should I say?',
				required: true
			}
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
		let text = options.getString('text')
		return await int.reply({
			content: text,
			allowedMentions: {
				parse: ["users"]
			}
		});
	}
})
const {
    TextInputComponent,
    Modal,
    CommandInteraction,
    MessageActionRow
  } = require('discord.js')
  const Slash = require('../classes/Slash');
  const Bot = require('../classes/Bot')
  module.exports = new Slash({
    path: __filename,
    data: {
      description: "Report a problem or suggest a feature to the developpers !"
    },
    /**
     * 
     * @param {{
     *   client: Bot,
     *   int: CommandInteraction,
     * }} param0 
     */
    run: async ({ client, int }) => {
      const modal = new Modal()
        .setCustomId('report')
        .setTitle('Feedback')
        .setComponents(
          new MessageActionRow()
            .setComponents(new TextInputComponent()
              .setCustomId('type')
              .setLabel('Type')
              .setStyle("SHORT")
              .setMinLength(1)
              .setMaxLength(100)
              .setPlaceholder('Is it a bug ? a suggestion or maybe a question ?')
              .setRequired(true)),
          new MessageActionRow()
            .setComponents(
              new TextInputComponent()
                .setCustomId('text')
                .setLabel("Message")
                .setStyle("PARAGRAPH")
                .setMinLength(1)
                .setMaxLength(1000)
                .setPlaceholder('What is the problem ?')
                .setRequired(true)
            )
        )
  
      await int.showModal(modal)
    }
  })

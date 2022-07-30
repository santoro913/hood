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
      description: "Fais ta demande pour devenir un moderateur  !"
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
              .setCustomId('text')
              .setLabel("**Qualités, defaults, age**")
              .setStyle("SHORT")
              .setMinLength(1)
              .setMaxLength(300)
              .setPlaceholder('Qualités, defaults, age')
              .setRequired(true)),
          new MessageActionRow()
            .setComponents(
              new TextInputComponent()
                .setCustomId('text')
                .setLabel("**Embitions, motivations**")
                .setStyle("PARAGRAPH")
                .setMinLength(1)
                .setMaxLength(1000)
                .setPlaceholder('Message...')
                .setRequired(true)
            )
        )
  
      await int.showModal(recrutement.js)
    }
  })
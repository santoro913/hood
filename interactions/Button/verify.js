const {
    Interaction,
} = require("discord.js");
const Bot = require("../../classes/Bot");
/**
 * @param {{ client: Bot, int: Interaction}} param0
 */
module.exports.run = async ({ client, int }) => {
    if (int.customId !== "verify") return;
    await int.deferReply({ ephemeral: true })
    await Promise.all([
        int.member.roles.add("1002705816140402728"),
    ]);
    return await int.editReply("Vous êtes maintenant vérifié sur le serveur !")
};
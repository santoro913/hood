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
        int.member.roles.add("986632229235064833"),
        int.member.roles.remove("988484316680028190")
    ]);
    return await int.editReply("Vous êtes maintenant vérifié sur le serveur !")
};
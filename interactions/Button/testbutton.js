const {
    Interaction,
} = require("discord.js");
const Bot = require("../../classes/Bot");
/**
 * @param {{ client: Bot, int: Interaction}} param0
 */
module.exports.run = async ({ client, int }) => {
    if (int.customId !== "testbutton") return;
    int.reply("Le bouton avec l'id 'testbutton' a été cliqué");
};

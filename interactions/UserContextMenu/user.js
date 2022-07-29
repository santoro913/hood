const { Interaction } = require('discord.js');
const Bot = require('../../classes/Bot');;
/**
 * @param {Bot} client 
 * @param {Interaction} int 
 */
module.exports.run = async ({ client, int }) => {
    let name = int.commandName;
    let cmd = client.slash.find(c => c.data.name === name);
    let target = int.targetMember
    if (!cmd) return console.error('Unknwon user command',int);

    console.logg("💬",name,int.user.tag,target.user.tag);
    try {
        await cmd.run({ client, int, target })
    } catch (err) {
        console.error(err);
        if(client.isDev(int.user)) return await int.reply(err.message ?? err.toString() ?? 'Une erreure est apparue!')
        await int.reply("An error has been detected when running the command ! D:");
    }
}
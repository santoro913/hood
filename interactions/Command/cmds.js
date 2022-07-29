const Discord = require('discord.js');
const Bot = require('../../classes/Bot');
/**
 * @param {Bot} client 
 * @param {Discord.Interaction<Discord.CacheType>} int 
 */
module.exports.run = async ({ client, int }) => {
    if (!int.isCommand()) return;
    let name = int.commandName;
    let cmd = client.slash.get(name);
    let options = int.options,
    data = options.data,
    id = int.user.id;

    console.log(2)
    if (!client.isDev(id)) {
        console.log(1)
        if (cmd.priv) return await int.reply('You are not allowed to use this command.');
        if (client.cooldowns.has(id)) return await int.reply("Calm down D: !");
        client.cooldowns.add(id);
        setTimeout(() => client.cooldowns.delete(id), 1000 * 3);
        if(!cmd.dm && !int.inGuild())
            return await int.reply(":x: Cette commande est uniquement autorisée dans un serveur et non en message privé.")
    };

    console.logg(`💬`,`${int.user.tag} - ${cmd.data.name}`);

    try {
        await cmd.run({ client, int, options });
    } catch (err) {
        console.error(err);
        if(client.isDev(int.user)) return await int.reply(err.message ?? err.toString() ?? 'Une erreure est apparue!')
        await int.reply("An error has been detected when running the command ! D:");
    }
}
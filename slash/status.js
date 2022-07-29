const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Paimon = require('../classes/Bot')
const moment = require('moment')
const PageSystem = require('dispage')

module.exports = new Slash({
    path: __filename,
    data: {
        description: "Get your activites or the activites or another user.",
        options: [
            {
                type: 'USER',
                name: 'user',
                description: 'Who?',
                required: true
            }
        ]
    },
    /**
     * @param {{
     *   client : Paimon,
     *   int : Discord.BaseCommandInteraction,
     *   options : Discord.CommandInteractionOptionResolver,
     *   sub : string
     * }}
     */
    run: async ({ client, int, options, sub }) => {
        let member = options.getMember("user")
            || int.member;

        d = member.user.id == int.user.id ? "your" : `**${member.user.tag}**'s'`;
        if (!member.presence) return await int.reply(`:x: I can't access ${d} activity`);

        let activities = member.presence.activities
        d = member.user.id == int.user.id ? "You don't" : `**${member.user.tag}** doesn't`;
        if (!member.presence.activities.length) return await int.reply(`:x: ${d} seem like doing anything.`);

        console.log(member.presence.activities)
        /**
         * @param {Discord.Activity} a the activity
         * @returns {Discord.MessageEmbed}

         */
        function list(a) {
            const embed = new Discord.MessageEmbed()
                .setFooter({
                    text: member.user.username,
                    iconURL: member.user.av(),
                })

            if (a.url)
                embed.addFields({ name: 'URL', value: `\`\`\`md\n${a.url}\`\`\`` });
            if (a.emoji?.url)
                embed.setImage(`${a.emoji.url}?size=4096`);
            if (a.assets) {
                if (a.assets?.smallImage && a.assets?.smallText) {
                    embed.setAuthor({
                        name: a.assets.smallText || a.name,
                        iconURL: a.assets.smallImageURL(client.imgOpts)
                    })
                }
                if (a.assets?.largeImage) {
                    embed.setThumbnail(a.assets.largeImageURL(client.imgOpts));
                }
            }
            if(a.platform){
                embed.setAuthor({
                    name : a.platform.toUpperCase(),
                    iconURL: `https://img.icons8.com/dusk/344/${a.platform}.png`
                });
            }
            if (a.name === "Spotify") {
                embed
                    .setColor('GREEN')
                    .setAuthor({ name: "Spotify", iconURL: "https://img.icons8.com/dusk/344/spotify.png" })
                    .addFields(
                        { name: "Title", value: `\`\`\`md\n${a.details}\`\`\`` },
                        { name: "Artist", value: `\`\`\`md\n${a.state}\`\`\`` },
                        { name: "Album", value: `\`\`\`md\n${a.assets?.largeText}\`\`\`` }
                    );
            } else if (a.name === 'Twitch' && a.type === 'STREAMING') {
                embed
                    .setColor("#9f38ff")
                    .setAuthor({ name: "Twitch", iconURL: "https://img.icons8.com/dusk/344/twitch.png" })
                    .setTitle(a.details)
                    .addFields(
                        { name: 'Game/Activity', value: `\`\`\`md\n${a.state}\`\`\`` },
                        { name: 'Link', value: `\`\`\`md\n${a.url}\`\`\`` }
                    );
            } else if (a.name === 'Visual Studio Code') {
                function isFile(text) {
                    return [".", "File", "Editing", "Edit"]
                        .some(t1 => text.toLowerCase().includes(t1.toLowerCase()));
                };
                let file = [a.details, a.state].find(isFile);
                let workspace = [a.details, a.state].find(t => !isFile(t));
                let fixWork = text => text
                    .replace('Workspace', '')
                    .replace('workspace', '')
                    .replace(':', '')
                    .trim();
                let fixFile = text => text.split(' ').find(f => f.includes('.'));

                embed
                    .setColor("#4d8bff")
                    .setAuthor({ name: "Visual Studio Code", iconURL: "https://img.icons8.com/fluency/344/visual-studio-code-2019.png" })
                if (a.details && a.state) embed.addFields(
                    { name: 'Workspace', value: `\`\`\`md\n${fixWork(workspace)}\`\`\`` },
                    { name: 'File', value: `\`\`\`md\n${fixFile(file)}\`\`\`` }
                );
            } else if (a.name === 'osu!') {
                embed
                    .setColor("#ff91e9")
                    .setAuthor({ name: "osu!", iconURL: "https://img.icons8.com/dusk/344/osu.png" })
                    .addFields(
                        { name: 'Profile', value: `\`\`\`md\n${a.assets?.largeText}\`\`\`` },
                        { name: 'Music', value: `\`\`\`md\n${a.details}\`\`\`` },
                        { name: 'Action', value: `\`\`\`md\n${a.state}\`\`\`` }
                    );
            } else if (a.name === 'GitHub') {
                embed
                    .setColor("#333333")
                    .setAuthor({ name: "Github", iconURL: "https://img.icons8.com/dusk/344/github.png" })
                    .addFields(
                        { name: 'Action', value: `\`\`\`md\n${a.details}\`\`\`` },
                        { name: 'Repository', value: `\`\`\`md\n${a.state}\`\`\`` }
                    )
            } else if (a.name === 'League of Legends') {
                embed
                    .setColor("#FF8300")
                    .setAuthor({ name: "League of Legends", iconURL: "https://img.icons8.com/dusk/344/league-of-legends.png" })
                    .addFields(
                        { name: 'Action', value: `\`\`\`md\n${a.state}\`\`\`` },
                        { name: 'Character', value: `\`\`\`md\n${a.assets?.largeText}\`\`\`` },
                        { name: 'Map', value: `\`\`\`md\n${a.details}\`\`\`` }
                    );
            } else if (a.name === "Fortnite") {
                let g = a.details.split('-').map(e => e.trim())
                let last = a.details.split(' ').slice(0, -1)
                embed
                    .setColor('#9d4dbb')
                    .setAuthor({ name: 'Fortnite', iconURL: "https://img.icons8.com/dusk/344/fortnite.png" })
                    .addFields(
                        { name: "Game", value: `\`\`\`md\n${g[0]}\`\`\`` },
                        { name: "Lasting", value: `\`\`\`md\n${last[last.length - 1]}\`\`\`` },
                        { name: "Level", value: `\`\`\`md\n${a.assets.smallText}\`\`\`` },
                    )
            } else {
                embed.setTitle(a.name);
                if (a.state)
                    embed.setDescription(a.state.includes('.gg/') ? `||${a.state}||` : a.state);
            }
            if (a.timestamps) {
                let { start, end } = a.timestamps;
                    if (start) {
                        embed.addFields({
                            name: "Started",
                            value: `\`\`\`md\n${moment(start).fromNow()}\`\`\``
                        });
                    };
                    if (end) {
                        embed.addFields({
                            name: 'Will end',
                            value: `\`\`\`md\n${moment(end).fromNow()}\`\`\``
                        });
                    };
                }
            if (a.buttons.length) embed.addFields({
                name: "Buttons",
                value: `\`\`\`md\n${a.buttons.join(' | ')}\`\`\``
            });
            if (a.party?.size?.length) embed.addFields({
                name: 'Party',
                value: `\`\`\`md\n${a.party.size.join('/')}\`\`\``
            });
            return embed;
        }
        let embeds = activities.map(list)
        return new PageSystem(client)
            .setEmbeds(embeds)
            .start(int)
    }
})
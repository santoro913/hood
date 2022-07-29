const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Bot = require('../classes/Bot');
const Dispage = require('dispage');

module.exports = new Slash({
    path : __filename,
	data : {
		description : "List you a specific category of the server",
        options : [
            {
                name : 'type',
                description : 'What to list ?',
                type : 'STRING',
                required : true,
                choices : [
                    { name: 'Channels', value: 'channels' },
                    { name: 'Roles'   , value: 'roles'    },
                    { name: 'Emojis'  , value: 'emojis'   },
                    { name: 'Stickers', value: 'stickers' },
                    { name: 'Humans'  , value: 'humans'   },
                    { name: 'Bots'    , value: 'bots'     },
                    { name: 'Members' , value: 'members'  }
                ]
            }
          ]
    },
    /**
     * @param {{
     *   client : Bot,
     *   int : Discord.BaseCommandInteraction,
     *   options : Discord.CommandInteractionOptionResolver,
     *   sub : string
     * }}
     */
    run: async ({ client, int, options, sub }) => {
        
        let s = int.guild;
        let be = client.blacke;
        let m = s.members.cache.map(m => m);
        let clist = [];
        let types = [
            ["GUILD_NEWS", "GUILD_TEXT"],
            ["GUILD_VOICE"],
            ["GUILD_STAGE_VOICE"]
        ];
        switch (options.getString('type')) {
            case 'emojis':
                let emojis = s.emojis.cache.map(fix);
                if(!emojis.length) return int.reply(':x: No emojis are present on this server.')
                let emojiEmbeds = chunk(emojis,20).map(es => new Discord.MessageEmbed()
                .setDescription(es.join('\n')));
                await pages(int,emojiEmbeds);
            break;
            case 'stickers':
                let stickers = s.stickers.cache.map(e =>e)
                if(!stickers.length) return int.reply(':x: No sticker found on this server.')
                let embedStickers = stickers.map(s => new Discord.MessageEmbed()
                .setImage(s.url)
                .setDescription(`**Name :** \`${s.name}\`\n`
                + `**Tags :** \`${s.tags.map(t => `\`${t}\``).join(', ')}\n`
                + `**ID :**\`${s.id}\``));
                await pages(int,embedStickers)
            break;
            case 'roles':
                let roles = s.roles.cache.sort(sortCreated).map(fix)
                if(!roles.length) return int.reply(':x: No role found on this.server.')
                let embedRoles = chunk(roles,20).map(r => new Discord.MessageEmbed()
                .setDescription(r.join('\n')))
                await pages(int,embedRoles)
            break;
            case 'humans':
                let humans = m.filter(m => !m.user.bot);
                await pages(int,chunk(humans,20).map(hms => new Discord.MessageEmbed()
                .setTitle('Server humans')
                .setDescription(hms.map(fix).join('\n'))))
            break;
            case 'bots':
                let bots = m.filter(m => m.user.bot);
                await pages(int,chunk(bots,20).map(bs => new Discord.MessageEmbed()
                .setTitle('Server bots')
                .setDescription(bs.map(fix).join('\n'))))
            break;
            case 'members':
                await pages(int,chunk(m,20).map(ms => new Discord.MessageEmbed()
                .setTitle('Server members')
                .setDescription(ms.map(fix).join('\n'))))
            break;
            case 'channels':
                getChannels(c => c.type !== "GUILD_CATEGORY" && !c.parentId)
                    .sort(sort)
                    .map(push);
                getChannels(c => c.type === "GUILD_CATEGORY")
                    .sort(sort)
                    .map(mapChannelsOfCategory);

                let channelEmbeds = clist.filter(Boolean).chunk(30).map(l => new Discord.MessageEmbed()
                    .setDescription(l.join('\n')));
                await pages(int, channelEmbeds);
            break;
        }
        function sortCreated(a,b){
            return a.createdTimestamp - b.createdTimestamp;
        }
        function pages(int,embeds){
            return new Dispage(client)
            .setEmbeds(embeds)
            .start(int);
        }
        /**
         * 
         * @param {Discord.Emoji | Discord.GuildMember | Discord.Role | Discord.GuildChannel} i 
         * @returns {String} Fixed input
        */
        function fix(i){
            if(i instanceof Discord.Emoji) return `${i} : \`${i}\``;
            if(i instanceof Discord.GuildMember) return `${i} \`${i.user.id}\``;
            if(i instanceof Discord.Role) return `${i}${i.managed ? " 🔒":''} \`${i}\``;
            if(i instanceof Discord.GuildChannel){
                if (i.type === 'GUILD_CATEGORY')
                    return `\n> ${be.bot} \`${i.name.toUpperCase()}\``;
                else if (i.type === "GUILD_NEWS")
                    return `${be.megaphone} \`${i.name}\``;
                else if (s.rulesChannelId === i.id)
                    return `${be.rules} \`${i.name}\``;
                else if (i.type === "GUILD_VOICE")
                    return `${be.voice} \`${i.name}\` ${i.userLimit ? `(${i.members.size}/${i.userLimit})` : ''}`
                        + (i.members.size ? (i.members.map(m => `\n└ \`${m.nickname || m.user.tag}\` ${voiceSituation(m)}`)).join('\n') : '');
                else if (i.type === "GUILD_STAGE_VOICE")
                    return `${be.stage} \`${i.name}\``;
                else
                    return `${be.text} \`${i.name}\``;
            }
        }
        /**
         *
         * @param {Discord.GuildChannel} c
         * @returns {void}

         */
         function push(c) {
            return clist.push(fix(c));
        }
        /**
         * @param {Discord.GuildMember} member
         * @returns {String}

         */
        function voiceSituation(member) {
            let data = [];
            if (member.voice.mute)
                data.push(be.mute);
            if (member.voice.deaf)
                data.push(be.deaf);
            return data.join(' ');
        }

        /**
         * @param {Discord.GuildChannelTypes} type
         * @param {Discord.CategoryChannel} category
         */
        function addSpecificTypes(types, category) {
            let channels = s.channels.cache.filter(c => types.includes(c.type) && !c.parentId);
            if (category) channels = category.children.filter(c => types.includes(c.type));
            channels.forEach(push);
            return channels;
        }

        /**
         * @param {Discord.GuildChannel} a
         * @param {Discord.GuildChannel} b
         */
        function sort(a, b) {
            return a.position - b.position;
        }
        /**
         * @param {Discord.GuildChannel} c
         */
        function mapChannelsOfCategory(c) {
            if (c) push(c);
            return types
                .sort(sort)
                .map(types => addSpecificTypes(types, c));
        }


        /**
         * @param {Function} filter
         */
        function getChannels(filter) {
            return s.channels.cache
            .filter(m => int.member.permissionsIn(m).has('VIEW_CHANNEL'))
            .filter(filter);
        }

        function chunk(current_arr,n = 1) {
            let arr = [];
            for (let i = 0; i < current_arr.length; i += n)
                arr.push(current_arr.slice(i, i + n));
            return arr;
        }
    }
})
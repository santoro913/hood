const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Bot = require('../classes/Bot')

module.exports = new Slash({
    path : __filename,
    dm : true,
    data : {
        description : 'Spy what device a user is using to connect to Discord 👀',
        options : [
            {
                name :'user',
                description : 'What user specifically by default you.',
                type : "USER"
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
        let member = options.getMember("user")
            || int.member;
        if(!member) return int.reply(':x: No member found.');
        let d = member.user.id === int.user.id ? "your" : `${member.user.id}'s`;
        if(!member.presence) return int.reply(`:x: I can't access ${d} presence`)
        const _d = member.presence.clientStatus;
        const devices = [];
        if(_d.desktop) devices.push("a desktop");
        if(_d.mobile ) devices.push("a phone");
        if(_d.web    ) devices.push("a browser");
        d = member.user.id == int.user.id ? "You are" : `${member.user.tag} is`;
        if(!_d) return int.reply(`:x: ${d} not using any device. (or is Invisible).`);
        return int.reply(`:white_check_mark:  ${d} connected via ${devices.join(' & ')}`);
    }
})
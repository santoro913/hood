const {
    CommandInteraction,
    MessageActionRow,
    MessageEmbed,
    MessageButton,
    Message
} = require("discord.js");
const Discord = require('discord.js')
const Slash = require('../classes/Slash')
const Bot = require('../classes/Bot')
module.exports = new Slash({
    path : __filename,
    data : {
        description : 'Open the calculator 👀'
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
        return new module.exports.Calculator(int)
    }
})
module.exports.Calculator = class Calculator {
    /**
     * @param {CommandInteraction} int 
     */
    constructor(int) {
        this.int = int;
        this.id = int.user.id;
        this.client = int.client;
        this.calcul = "";
        this.ended = false;
        this.reply = null;
        this.index = 0;
        this.infinity = "∞";
        this.start()
    }
    /**
     * @returns {MessageEmbed}

     */
    getEmbed() {
        return new Discord.MessageEmbed()
            .addFields([
                {
                    name: "Input",
                    value: this.calcul ? (`${this.calcul}\n${" ".repeat(this.index)}^`) : "...",
                },
                {
                    name: "Output",
                    value: this.result(this.calcul) || "❌"
                }
            ])
    }
    /**
     * @param {string} calcul 
     * @returns {string}

     */
    result(calcul) {
        try {
            const pi = Math.PI;
            return eval(calcul
                .replace(this.infinity, 'Infinity'))
                ?.toString()
                .replace('Infinity', this.infinity)
        } catch (e) {
            return;
        }
    }
    update(disabled) {
        if (disabled) this.ended = true;
        return this.int.editReply({
            embeds: [this.getEmbed()],
            components: this.getRows(disabled)
        })
    }
    async start() {
        try {
            let rows = this.getRows()
            let opts = {
                embeds: [this.getEmbed()],
                components: rows
            }
            /**
             * @type {Message}

             */
            this.reply = await this.int.reply({...opts, fetchReply : true}).catch(console.error);
            if (!this.reply) return;
            this.collector = this.reply.createMessageComponentCollector({
                filter: (i) => i.user.id == this.id,
                time: 1000 * 60 * 5
            });

            this.collector.on('collect', int1 => {
                int1.deferUpdate();
                let id = decodeURIComponent(int1.customId)
                if (id == 'clear') {
                    this.calcul = "";
                    this.index = 0;
                } else if (id == 'del') {
                    if (this.index !== 0) {
                        this.calcul = this.calcul.slice(0, this.index - 1) + this.calcul.slice(this.index);
                        --this.index;
                    }
                } else if (id === "equal") {
                    this.collector.stop()
                    return this.update(true);
                } else {
                    if (this.calcul.length > 1000) {
                        return int1.reply("Calcul is way too long.", { ephemeral: true })
                    } else if (id == 'left') {
                        if (this.index !== 0) this.index--;
                    } else if (id == 'right') {
                        if (this.index !== this.calcul.length) this.index++;
                    } else if (id === "pi") {
                        this.insert('pi', this.index)
                        this.index += 2;
                    } else {
                        this.insert(id, this.index);
                        this.index += id.length;
                    }
                }
                this.update();
            })
            this.collector.on('end', () => this.update(true))
        } catch (err) { console.error(err) };
    }
    insert(what,index){
        this.calcul = this.calcul.slice(0, index) + what + this.calcul.slice(index);
    }
    /**
     * @param {boolean} disabled 
     * @returns {MessageActionRow[]}

     */
    getRows(disabled = false) {
        let total = [
            [
                { e: "📰", id: 'clear', s: 'danger' },
                { l: "(", id: '(', s: "PRIMARY" },
                { l: ")", id: ')', s: "PRIMARY" },
                { l: "<", id: 'left', s: "PRIMARY" },
                { l: ">", id: 'right', s: "PRIMARY" }
            ],
            [
                { l: "1", id: "1" },
                { l: "2", id: "2" },
                { l: "3", id: "3" },
                { l: "+", id: "+", s: "PRIMARY" },
                { l: "DEL", id: "del", s: "DANGER" }
            ],
            [
                { l: "4", id: "4" },
                { l: "5", id: "5" },
                { l: "6", id: "6" },
                { l: "-", id: "-", s: "PRIMARY" },
                { l: "^", id: "**", s: "PRIMARY" }
            ],
            [
                { l: "7", id: "7" },
                { l: "8", id: "8" },
                { l: "9", id: "9" },
                { l: "x", id: '*', s: "PRIMARY" },
                { l: "%", id: '%', s: "PRIMARY" }
            ],
            [
                { l: ".", id: "." },
                { l: "0", id: "0" },
                { l: "π", id: "p" },
                { l: "/", id: "/", s: "PRIMARY" },
                { e: "✅", id: "equal", s: "SUCCESS" }
            ]
        ]
        /*
        
             */
        let rows = total.map(row => new MessageActionRow()
            .setComponents(row.map(b => {
                let btn = new MessageButton()
                    .setCustomId(encodeURIComponent(b.id))
                    .setStyle(b.s?.toUpperCase() || "SECONDARY")
                    .setDisabled(disabled)
                if (b.l) btn.setLabel(b.l)
                if (b.e) btn.setEmoji(b.e);
                return btn;
            })))
        return rows;
    }
};
const Discord = require('discord.js'),
    { readdirSync } = require('fs'),
    { DiscordTogether } = require('discord-together'),
    { join } = require('path');
const Command = require('./Command'),
    Slash = require('./Slash'),
    Database = require('./Database'),
    Event = require('./Event'),
    Interval = require('./Interval');


module.exports = class Bot extends Discord.Client {
    /**
     * @param {Discord.ClientOptions} opts 
     */
    constructor(opts) {
        super(opts);
        this.paths = {
            events: './events/',
            commands: './commands/',
            slash: './slash/',
            proto: './proto',
            classes: './classes/',
            config: './config',
            intervals: './intervals/'
        };
        this.imgOpts = { dynamic: true, size: 4096, format: "png" };
        // Login
        this.login(process.env.TOKEN)
        /**
         * Collection of bot's events
         * @type {Discord.Collection<string, Event>} 
         */
        this.events = new Discord.Collection();
        /**
         * Collection of bot's commmands
         * @type {Discord.Collection<string, Command>} 
         */
        this.commands = new Discord.Collection();
        /**
         * Collection of bot's slash commmands
         * @type {Discord.Collection<string, Slash>} 
         */
        this.slash = new Discord.Collection();
        /**
         * Collection of bot's intervals
         * @type {Set<Interval>}} 
         */
        this.intervals = new Set();
        /**
         * Set of bot's cooldown users
         * @type {Set<string>}
         */
        this.cooldowns = new Set();
        this.act = new DiscordTogether(this);
        /** Function used to search on discord.js documentation  */
        this.db = new Database("./db.json");
        
        return this.start();
    }
    getMessage(id) {
        return this.channels.cache.find(c => c.messages.cache.has(id)).messages.cache.get(id);
    }
    start() {
        this.loadConfig();
        this.loadCommands();
        this.listenToEvents();
    }
    setObjectPropsToClient(obj) {
        Object.keys(obj).forEach(k => {
            this[k] = obj[k];
        });
        return obj;
    }
    /**
     * Loads the configuration file.
     */
    loadConfig() {
        let p = this.getPath(this.paths.config);
        delete require.cache[require.resolve(p)]
        let c = require(p)
        this.setObjectPropsToClient(c);
        console.logg('✅', 'Configurations loaded.')
    }
    get mainPath() {
        return require.main.path;
    }
    getPath(...path) {
        return join(...[this.mainPath, ...path].filter(Boolean));
    }
    /**
     * @param {string} path
     * @param {Function} loop The function that will run on every file on the folder.
     */
    loopFilesOf(path, loop) {
        let p = this.getPath(this.paths[path] || path);
        let files = readdirSync(p).filter(f => f.endsWith('.js'))
        files.map(e => {
            e = e.split('.')[0];
            let file = require(require('path').join(p + e));
            if (loop) return loop(file, e);
        });
    }
    /**
     * Loads events.
     * @returns {Discord.Collection<string,Event>}
     */
    loadEvents() {
        this.loopFilesOf('events', e => this.loadEvent(e.name));
        console.logg('✅', 'Events loaded.')
        return this.events;
    }
    loadEvent(name) {
        const path = this.getPath(this.paths.events + name)
        let e = require(path);
        if (!(e instanceof Event)) return console.error(`Invalid event ${name} !`);
        delete require.cache[require.resolve(e.path)]
        e = require(e.path);
        this.events.set(e.name, e);
        return this.events.get(e.name);
    }
    loadSlash(name) {
        let s = this.slash.get(name) || name;
        let f = s instanceof Slash ? s : require(`./slash/${s}`);
        if (!(f instanceof Slash)) return console.error('Invalid slash command', s, f);
        delete require.cache[require.resolve(f.path)]
        f = require(f.path)
        this.slash.set(f.name, f);
        return this.slash.get(f.name)
    }
    /**
     * Load commands
     */
    loadCommands() {
        this.loopFilesOf('commands', cmd => {
            this.loadCommand(cmd.name);
        });
    }
    loadCommand(name) {
        let path = this.getPath(this.paths.commands, name)
        delete require.cache[require.resolve(path)]
        let cmd = require(path);
        if (!cmd) return console.error(`No command "${name}"`);
        if (!(cmd instanceof Command)) return console.error(`Invalid command`);
        this.commands.set(cmd.name, cmd);
        return cmd;
    }
    async loadSlashs() {
        this.slash = new Discord.Collection();
        this.loopFilesOf('slash', s => {
            if (!(s instanceof Slash)) return console.error('Invalid slash command');
            delete require.cache[require.resolve(s.path)]
            s = require(s.path);
            this.slash.set(s.name, s);
        });
        // let cmds = await this.application.commands.fetch({ guildId: this.privateGuildId })
        // cmds.forEach(cmd => {
        //     const slash = this.slash.get(cmd.name);
        //     if (slash) slash.setID(cmd.id);
        //     else console.error(`Slash command ${cmd.name} not found!`)
        // });
        console.logg('✅', 'Slash commands loaded.')
    }
    async putSlashs() {
        try {
            await this.application.commands.set(this.slash.map(e => e.data));
        } catch (message) {
            console.error(message);
        }
        return console.logg(`📬`, `Successfully PUT (/) commands.`);
    }
    async putSlashs() {
        let to = e => e.data
        try {
            await Promise.all([
                this.application.commands.set(this.slash.filter(c => !c.private).map(to)),
                this.guilds.cache.get(this.privateGuildId).commands.set(this.slash.filter(c_1 => c_1.private).map(to))
            ]);
        } catch (message) {
            console.error(message);
        }
        return console.logg(`📬`, `Successfully PUT (/) commands.`);
    }
    /**
     * Listen to the events (eg. messageCreate, ready etc..)
     */
    listenToEvents() {
        this.loadEvents().forEach(e => {
            this[e.type](e.name, async (...args) => {
                try {
                    await e.run(this, ...args)
                } catch (err) {
                    console.error(err);
                }
            });
        })
        console.logg('✅', 'Events are now listenned.')
    }
    loadTimers() {
        console.logg('✅', 'Timers are now loaded.')
        return this.db.get('timers').forEach(opts => this.setTimeout(opts));
    }
    loadIntervals() {
        console.logg('✅', 'Intervals are now loaded.')
        this.loopFilesOf('intervals', (i, name) => {
            this.intervals.add(new Interval({ name, client: this, ...i }))
        });
    }
    wingify(text) {
        return `<a:wingleft:937650049947672586> ${text} <a:wingright:937650076715745280>`;
    }
    merge(...objects) {
        let obj = {};
        objects.forEach(o => { obj = { ...o, ...obj } })
        return obj;
    }
    /**
     * @param {string} text Cleans text so it can be used inside a block ```
     * @returns {string} Cleaned text
     */
    clean(text) {
        if (typeof (text) === "string") text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        return text;
    };
    setTimeout({ id, options, when, type, run }) {
        return new Timer({
            client: this,
            id, type, options, when, run
        })
    };
    remind({ msg, userID, channelID }) {
        let user = this.users.cache.get(userID)
        if (!user) console.error(user);
        let channel = this.channels.cache.get(channelID)
        let text = `${this.blacke.notif} ${user}`
            + `${channel ? `: ${channel}` : ''}`
            + `${msg ? `: \`${msg}\` ` : ''}`;

        user.send(text)
            .then(() => console.logg(`💌`, `Rappel`, user.tag, msg))
            .catch(this.err)
    };
    async fetchMessageURL(url) {

        let [guildId, channelId, messageId] = url.split('/').slice(4);

        const guild = this.guilds.cache.get(guildId)
            || await this.guilds.fetch(guildId).catch(_ => 0);
        if (!guild) return;

        const channel = guild.channels.cache.get(channelId)
            || await guild.channels.fetch(guildId).catch(_ => 0);
        if (!channel) return;

        const message = channel.messages.cache.get(messageId)
            || await channel.messages.fetch()
                .then(() => channel.messages.cache.get(messageId))
                .catch(_ => 0);

        return message;
    }

    /**
     * @param {string | Discord.GuildMember | Discord.User} user 
     * @returns {boolean} If the user is a developper
     */
    isDev(user) {
        const id = user.id || user;
        if (typeof (id) !== "string") {
            console.log('not a string')
            throw new Error(user);
        }
        return this.devs.includes(id);
    }
    get owner() {
        return this.users.cache.get(this.devs[0]);
    }
}
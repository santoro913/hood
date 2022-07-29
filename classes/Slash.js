const { ApplicationCommandData } = require('discord.js')
module.exports = class Slash {
    /**
     * @param {{
     *     priv : boolean,
     *     file : string,
     *     data: ApplicationCommandData,
     *     run : Function
     * }} data
     * @example

     * new Slash({
     *     priv : false,
     *     path : __filename,
     *     data : {},
     *     run (client, message, args){
     * 
     *     }
     * })
     */
    constructor({
        priv,
        path,
        dm,
        data,
        run
    }){
        if(!path) throw Error('No path given')
        if(!data) throw Error('No data given')
        this.priv = priv ?? false;
        this.path = path ?? null;
        this.data = data ?? null;
        this.name = path.toName() ?? null;
        this.id = null;
        this.data.type = this.data.type ?? 1;
        this.data.name = this.data.name || this.name;
        this.run = run;
        this.dm = dm || false;
        return this;
    }
    setID(id){
        this.id = id;
    }
}
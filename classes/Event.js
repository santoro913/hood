module.exports = class Event {

    /**
     * @param {{
     *     path: string,
     *     aliases : string[],
     *     type: "on"|"once",
     *     run : Function
     * }} opts
     * @example
     * new Event({
     *     path : __filename,
     *     aliases : [],
     *     type : 'on', // or once
     *     run (client, message, args){
     * 
     *     }
     * })
    */
    constructor({ path,aliases, type, run}){
        this.path = path;
        this.name = path.toName() ?? null;
        this.type = type || 'on';
        this.run = run;
        this.aliases = aliases || [];
        return this;
    }
    get once(){
        return this.type == 'once';
    }    
}
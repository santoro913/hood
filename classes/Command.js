module.exports = class Command {

    /**
     * @param {{
     *     path : string,
     *     aliases : string[],
     *     description : string,
     *     args : string[],
     *     uses : string[],
     *     category : string,
     *     priv : boolean,
     *     perms : Discord.PermissionString[],
     *     run : Function
     * }} opts
     * @example
     * new Command({
     *     path : __filename,
     *     aliases : [],
     *     description : '',
     *     args : [],
     *     uses : [],
     *     category : null,
     *     priv: false,
     *     perms : [],
     *     run (client, message, args){
     * 
     *     }
     * })
     * 
     * @example
     * new Command({
     *     path : __filename,
     *     run (client, message, args){
     * 
     *     }
     * })
    */
    constructor({
        path,
        aliases,
        description,
        args,
        uses,
        category,
        priv,
        perms,
        run,
        cooldown
    }){
        this.path = path || null;
        this.name = path.toName() ?? null;
        this.aliases = aliases || [];
        this.description = description || 'No description provided.';
        this.args = args || [];
        this.argsNeeded = Boolean(this.args.length);
        this.category = category || "main";
        this.uses = uses || [];
        this.priv = priv || false;
        this.perms = perms || [];
        this.cooldown = cooldown || 5 * 1000;
        this.run = run;
        return this;
    }
}
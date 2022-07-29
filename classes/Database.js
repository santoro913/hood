const { JsonDB } = require("node-json-db"),
      { Config } = require('node-json-db/dist/lib/JsonDBConfig');
module.exports = class Database extends JsonDB {
    constructor(){
        super(new Config("./db", true, true, '.'));
        this.sep = ".";
    }
    /**
     * Deletes a specific property.
     * @param {string} key 
     */
    delete(key){
        return this.delete(this.sep + key)
    }
    /**
     * Set a property to a value.
     * @param {string} key 
     * @param {any} value
     */
    set(key, value){
        this.push(this.sep + key, value)
    }
    /**
     * Get a value from a path
     * @param {string} key 
     */
    get(path){
        return this.getData(this.sep + path)
    }
    /**
     * Check if a path has a value
     * @param {string} key 
     */
    has(path){
        this.exists(this.sep + path)
    }
    /**
     * Push an element on an array
     * @param {string} key 
     * @param {any} value
     */
    add(key, value) {
        this.push(this.sep + key, [value], false)
        return this.getData(".")
    }
    filter (key, filter) {
        let data = this.getData(this.sep + key);
        data = data.filter(filter)
        this.push(this.sep + key, data);
        return this.getData(".")
    }
    remove (key, f) {
        let data = this.getData(this.sep + key);
        let found = data.find(f);
        if (!found) return false;
        data.splice(data.findIndex(f), 1)
        this.push(this.sep + key, data)
        return this.getData(".")
    }
}
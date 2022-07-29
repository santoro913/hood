module.exports = class Interval {
    constructor({
        run,
        delay,
        client,
        path
    }) {
        this.path = path;
        this.name = path.toName();
        this.client = client;
        this.run = run;
        this.delay = delay || (1000 * 60 * 5);
        this.interval = null;
        this.loadInterval();
    }
    stopInterval(){
        return clearInterval(this.interval);
    }
    loadInterval(){
        if(this.interval) stopInterval();
        this.interval = setInterval(() => this.run(this.client).catch(console.error), this.delay);
    }
}
class Memory {
    constructor() {
        this.datastore = {};
    }
    get() {
        return this.datastore;
    }
    set(obj) {
        for (let [key, values] of Object.entries(obj))
            this.datastore[key] = values;
    }
}

module.exports = Memory;
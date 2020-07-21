var datastore = {};

class Memory {
    constructor() { }
    get() {
        return datastore;
    }
    set(obj) {
        for (let [key, values] of Object.entries(obj))
            datastore[key] = values;
    }
}

module.exports = Memory;
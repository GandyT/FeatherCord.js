/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

class Guild {
    constructor(client, data) {
        this._client = client;
        this._id = data.id;
        this._data = data;
    }
    /* GETTERS */
    get id() {
        return this._id;
    }
    get name() {
        return this._data.name;
    }
    get iconURL() {
        return `https://cdn.discordapp.com/icons/${this._id}/${this._data.icon}`;
    }
    get features() {
        return this._data.features;
    }
    get members() {
        return this._data._members;
    }
    get channels() {
        return this._data._channels;
    }
    get categories() {
        return this._data.categories;
    }

    /* ACTIONS */
}

module.exports = Guild;
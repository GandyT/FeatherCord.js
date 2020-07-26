/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

class Guild {
    constructor(client, id, data) {
        this._client = client;
        this._id = id;
        this._data = data;
    }
    /* GETTERS */
    get id() {
        return this._id;
    }
    get name() {
        return this._data.name;
    }
    get description() {
        return this._data.description;
    }
    get iconURL() {
        return `https://cdn.discordapp.com/icons/${this._id}/${this._data.icon}`;
    }
    get ownerID() {
        return this._data["owner_id"];
    }
    get features() {
        return this._data.features;
    }
    get emojis() {
        return this._data.emojis;
    }
    get members() {
        return this._data.members;
    }
    get channels() {
        return this._data.channels;
    }
}

module.exports = Guild;
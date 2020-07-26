/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

class Guild {
    constructor(client, id) {
        this._client = client;
        this._id = id;
        this._data = {};
        FF.get(`${Config.APIEND}/guilds/${id}`, { "authorization": `Bot ${client.token}` })
            .then(res => {
                const Response = JSON.parse(res);
                this._data = Response;
            });
        this._members = [];
        this._client.on(`${id}-members`, (members) => {

        })
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
        return new Promise((resolve, reject) => {
            this._client.on("sendmembers", (members) => {
                resolve(members);
            });
        })
    }
}

module.exports = Guild;
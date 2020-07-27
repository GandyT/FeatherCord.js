/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

/* STRUCTURES */
const TextChannel = require("./TextChannel.js");

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
    createChannel(options) {
        var body = {}
        if (options.name) body.name = options.name;
        if (options.type) body.type = options.type == "text" ? 0 : options.type == "voice" ? 2 : "INVALID";
        if (options.category_id) body.parent_id = options.category_id;
        if (options.topic) body.topic = options.topic;
        if (options.nsfw) body.nsfw = options.nsfw;

        if (body.type == "INVALID")
            throw new Error("Invalid Channel Type. <createChannel>");

        return new Promise((resolve, reject) => {
            FF.post(`${Config.APIEND}/guilds/${this.id}/channels`, body, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    var Response = JSON.parse(res);
                    if (Response.retry_after) {
                        // Rate Limiting
                        return setTimeout(() => this.createChannel(options), Response.retry_after);
                    }
                    if (Response.message) throw new Error(Response.message);

                    resolve(new TextChannel(this._client, Response));
                });
        });
    }
}

module.exports = Guild;
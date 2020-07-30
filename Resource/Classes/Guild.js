/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

/* STRUCTURES */
const TextChannel = require("./TextChannel.js");
const Role = require("./Role.js");

class Guild {
    constructor(client, data) {
        this._client = client;
        this._data = data;
        try {
            this._data.roles = this._data.roles.map(role => {
                if (!role.position) return;
                role.guild_id = data.id;
                return new Role(client, role);
            });
            this._data.roles.shift();
        } catch { }
    }
    /* GETTERS */
    get id() {
        return this._data.id;
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
        return this._data.members;
    }
    get channels() {
        return this._data.channels;
    }
    get categories() {
        return this._data.categories;
    }
    get roles() {
        return this._data.roles;
    }
    /* ACTIONS */
    createChannel(options) {
        var body = {}
        if (options.name) body.name = options.name;
        if (options.type) body.type = options.type == "text" ? 0 : options.type == "voice" ? 2 : options.type == "category" ? 4 : "INVALID";
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

                    if (body.type == 0) {
                        let channel = new TextChannel(this._client, Response);
                        this._data.channels.push(channel);
                        resolve(channel);
                    }
                    resolve(Response);
                });
        });
    }
    createRole(options) {
        /* 
        name: string,
        permissions: array of perm names,
        color: hex or rgb value
        hoist: bool (should the role be displayed separately in the side bar)
        mentionable: bool
        */
        if (Array.isArray(options.permissions)) {
            var int = 0;
            for (let perm in options.permissions) {
                int = int | Config.PERMS[perm.toLowerCase()];
            }
            options.permissions = int;
        }
        if (options.color.charAt(0) == "#") {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(options.color);
            options.color = `${parseInt(result[1], 16)}${parseInt(result[2], 16)}${parseInt(result[3], 16)}`;
        }

        return new Promise((resolve, reject) => {
            FF.post(`${Config.APIEND}/guilds/${this.id}/roles`, options, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    const Response = JSON.parse(res);
                    if (Response.retry_after) {
                        return setTimeout(() => this.createRole(options));
                    }
                    if (Response.message) throw new Error(Response.message);
                    Response.guild_id = this.id;
                    let role = new Role(this._client, Response);
                    this._data.roles.push(role);
                    resolve(role);
                })
        });
    }
}

module.exports = Guild;
/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");
/* STRUCTURES */
const Message = require("./Message.js");
const Guild = require("./Guild.js");

class TextChannel {
    constructor(Client, data) {
        this._default = data;
        this._client = Client;
    }
    /* GETTERS */
    get id() {
        return this._default.id;
    }
    get name() {
        return this._default.name;
    }
    get topic() {
        return this._default.topic;
    }
    get type() {
        return
    }
    get nsfw() {
        return this._default.nsfw;
    }
    get dm() {
        return false;
    }
    get guild() {
        return this._client.guilds.find(guild => guild.id == this._default.guild_id);
    }
    get permissions() {
        return this._default.permission_overwrites;
    }

    /* ACTIONS */
    send(content) {
        return new Promise((resolve, reject) => {
            if (!content) throw "Specify Message Content";
            var headers = {
                authorization: `Bot ${this._client.token}`
            }
            if (!content.embed) {
                content = String(content);
                if (content.length > 2000) throw new Error("2000 character limit for text messages");
                var body = {
                    content: content,
                    tts: false,
                    embed: {},
                }


                FF.post(`${Config.APIEND}/channels/${this._default.id}/messages`, body, headers)
                    .then(res => {
                        var Response = JSON.parse(res);
                        if (Response.message) throw new Error(Response.message);
                        resolve(new Message(this._client, Response, null, this));
                    });
                // Regular Message
            } else {
                FF.post(`${Config.APIEND}/channels/${this._default.id}/messages`, content, headers)
                    .then(res => {
                        var Response = JSON.parse(res);
                        if (Response.message) throw new Error(Response.message);

                        resolve(new Message(this._client, Response, null, this));
                    });
                // Embed
            }
        })
    }
    // Next Action Here
    fetchMessage(id) {
        return new Promise((resolve, reject) => {
            FF.get(`${Config.APIEND}/channels/${this._id}/messages/${id}`, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    if (!res) throw new Error("Could not connect to server");
                    const Response = JSON.parse(res);
                    if (Response.message) throw new Error(Response.message);

                    console.log(Response);
                });
        })
    }
}

module.exports = TextChannel;
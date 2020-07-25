/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

/* STRUCTURES */
const TextChannel = require("./TextChannel.js");
const Message = require("./Message.js");
const Guild = require("./Guild.js");

class User {
    constructor(client, data) {
        this._client = client;
        this._data = data;
    }
    /* GETTERS */
    get id() {
        return this._data.id;
    }
    get username() {
        return this._data.username;
    }
    get tag() {
        return this._data.username + this._data.discriminator;
    }
    get mention() {
        return `<@${this._data.id}>`
    }
    avatarURL() {
        return this._data.avatar ? `${Config.AVATARURL}/${this._data.id}/${this._data.avatar.avatar}` : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
    }
    send(content) {
        return new Promise((resolve, reject) => {
            FF.post(`${Config.APIEND}/users/@me/channels`, { recipient_id: this._data.id }, { authorization: `Bot ${this._client.token}` })
                .then(dmchannel => {
                    dmchannel = JSON.parse(dmchannel);

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

                        FF.post(`${Config.APIEND}/channels/${dmchannel.id}/messages`, body, headers)
                            .then(res => {
                                var Response = JSON.parse(res);
                                if (Response.message) throw new Error(Response.message);
                                resolve(new Message(this._client, Response, undefined, new TextChannel(this._client, Response.channel_id)));
                            });
                        // Regular Message
                    } else {
                        FF.post(`${Config.APIEND}/channels/${dmchannel.id}/messages`, content, headers)
                            .then(res => {
                                var Response = JSON.parse(res);
                                if (Response.message) throw new Error(Response.message);
                                resolve(new Message(this._client, Response, undefined, new TextChannel(this._client, Response.channel_id)));
                            });
                        // Embed
                    }
                })
        })
    }
}

module.exports = User;
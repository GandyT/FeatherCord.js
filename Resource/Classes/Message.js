/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

class Message {
    constructor(client, data, author, channel) {
        // @private
        this._data = data;
        this._client = client;
        this._channel = channel;
        this._author = author;
        this._data.mentions.map((mention, index) => {
            this._data.mentions[index] = new User(client, mention);
        });

        /* ARRAY PROTOTYPE */
        var ArrayPrototype = JSON.parse(JSON.stringify(Array.prototype));
        ArrayPrototype.first = function () {
            return this[0];
        }
        ArrayPrototype.last = function () {
            return this[this.length - 1];
        }
        Object.setPrototypeOf(this._data.mentions, ArrayPrototype);
        Object.setPrototypeOf(this._data.mention_roles, ArrayPrototype);
    }
    get content() {
        return this._data.content;
    }
    get channel() {
        return this._channel;
    }
    get id() {
        return this._data.id;
    }
    get author() {
        return this._author;
    }
    get embeds() {
        return this._data.embeds;
    }
    get mentions() {
        return {
            members: this._data.mentions,
            roles: this._data.mention_roles,
        }
    }
    delete() {
        return new Promise((resolve, reject) => {
            FF.delete(`${Config.APIEND}/channels/${this._channel.id}/messages/${this._id}`, { 'authorization': `Bot ${this._client.token}` })
                .then(res => {
                    resolve(res);
                });
        })
    }
}

module.exports = Message;

/* HAAAAAAAAAAAAA HAD A CIRCULAR DEPEDENCY AND DIDN'T KNOW HOW TO FIX IT SO ENJOY! */

/* STRUCTURES */
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
/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");
const Reaction = require("./Reaction.js");
const Member = require("./Member.js");

class Message {
    constructor(client, data, author, channel, guild) {
        // @private
        this._data = data;
        this._client = client;
        this._channel = channel;
        this._author = author;
        this._guild = guild;
    }

    /* GETTERS */
    get content() {
        return this._data.content;
    }
    get channel() {
        return this._channel;
    }
    get guild() {
        if (this._guild)
            return this._guild;
    }
    get id() {
        return this._data.id || this._data.message_id;
    }
    get author() {
        return this._author;
    }
    get embeds() {
        return this._data.embeds;
    }
    get mentions() {
        if (this._data.mentions)
            return {
                members: this._data.mentions,
                roles: this._data.mention_roles,
            }
    }
    get member() {
        return this._client._guilds[this._data.guild_id]._data.members.find(member => member.id == this.author.id)
    }
    getReactions(emoji) {
        return new Promise((resolve, reject) => {
            FF.get(`${Config.APIEND}/channels/${this._data.channel_id}/messages/${this.id}/reactions/${encodeURI(emoji)}`, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    var Response = JSON.parse(res);
                    if (Response.retry_after) {
                        return setTimeout(() => this.getReactions(emoji), Response.retry_after);
                    }
                    if (Response.message) throw new Error(Response.message);
                    Response = Response.map(reaction => {
                        reaction.name = emoji;
                        return new Reaction(this._client, reaction, this);
                    });
                    resolve(Response);
                });
        });
    }


    /* ACTIONS */
    delete() {
        return new Promise((resolve, reject) => {
            FF.delete(`${Config.APIEND}/channels/${this.channel.id}/messages/${this.id}`, { 'authorization': `Bot ${this._client.token}` })
                .then((res) => {
                    resolve();
                });
        })
    }
    react(emoji) {
        var encoded = encodeURI(emoji);
        return new Promise((resolve, reject) => {
            FF.put(`${Config.APIEND}/channels/${this.channel.id}/messages/${this.id}/reactions/${encoded}/@me`, {}, { "authorization": `Bot ${this._client.token}` })
                .then((res) => {
                    if (res) {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            return setTimeout(() => this.react(emoji), Response.retry_after);
                        }
                    }
                    resolve(new Reaction(this._client, { name: emoji }, this));
                });
        });
    }
    edit(content) {
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
                    embed: {},
                }


                FF.patch(`${Config.APIEND}/channels/${this.channel.id}/messages/${this.id}`, body, headers)
                    .then((res) => {
                        if (res) {
                            var Response = JSON.parse(res);
                            if (Response.retry_after) {
                                return setTimeout(() => this.edit(content), Response.retry_after);
                            }
                        }
                        resolve(this);
                    });
                // Regular Message
            } else {
                FF.patch(`${Config.APIEND}/channels/${this.channel.id}/messages/${this.id}`, content, headers)
                    .then((res) => {
                        if (res) {
                            var Response = JSON.parse(res);
                            if (Response.retry_after) {
                                return setTimeout(() => this.edit(content), Response.retry_after);
                            }
                        }
                        resolve(this);
                    });
                // Embed
            }
        })
    }
}

module.exports = Message;
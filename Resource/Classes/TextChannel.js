/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");
const Fs = require("fs");

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
        return this._client.guilds.find[this._default.guild_id];
    }
    get permissions() {
        return this._default.permission_overwrites;
    }
    get category() {
        return this._client._guilds[this._default.guild_id]._categories.find(c => c.id == this._default.parent_id);
    }

    /* ACTIONS */
    send(content, file) {
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

                if (file)
                    var formData = {
                        name: file,
                        content: Fs.createReadStream(file)
                    }

                FF.post(`${Config.APIEND}/channels/${this._default.id}/messages`, body, headers, file ? formData : null)
                    .then(res => {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            // Rate Limited
                            return setTimeout(() => this.send(content), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);
                        resolve(new Message(this._client, Response, null, this, this.guild));
                    });
                // Regular Message
            } else {
                content.file = file;

                FF.post(`${Config.APIEND}/channels/${this._default.id}/messages`, content, headers)
                    .then(res => {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            // Rate Limited
                            return setTimeout(() => this.send(content), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);

                        resolve(new Message(this._client, Response, null, this, this.guild));
                    });
                // Embed
            }
        })
    }
    // Next Action Here
    fetchMessage(id) {
        return new Promise((resolve, reject) => {
            FF.get(`${Config.APIEND}/channels/${this.id}/messages/${id}`, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    if (!res) throw new Error("Could not connect to server");
                    const Response = JSON.parse(res);
                    if (Response.retry_after) {
                        return setTimeout(() => this.fetchMessage(id), Response.retry_after);
                    }
                    if (Response.message) throw new Error(Response.message);

                    resolve(new Message(this._client, Response, new Author(this._client, Response.author), this, this.guild));
                });
        })
    }
    delete() {
        return new Promise((resolve, reject) => {
            FF.delete(`${Config.APIEND}/channels/${this.id}`, { 'authorization': `Bot ${this._client.token}` })
                .then(res => {
                    if (res) {
                        try {
                            var Response = JSON.parse(res);
                            if (Response.retry_after) {
                                return setTimeout(() => this.fetchMessage(id), Response.retry_after);
                            }
                            if (Response.message) throw new Error(Response.message);
                        } catch { }
                    }
                    resolve();
                });
        });
    }
    fetchMany(amount) {
        return new Promise((resolve, reject) => {
            FF.get(`${Config.APIEND}/channels/${this.id}/messages?limit=${amount}`, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    var Response = JSON.parse(res);
                    if (Response.retry_after) {
                        return setTimeout(() => this.fetchMany(amount), Response.retry_after);
                    }
                    if (Response.message) throw new Error(Response.message);
                    Response = Response.map(message => {
                        return new Message(this._client, message, new Author(this._client, message.author), this, this.guild)
                    });
                    resolve(Response);
                })
        })
    }
    bulkDelete(amount) {
        return new Promise((resolve, reject) => {
            this.fetchMany(amount)
                .then(messages => {
                    var snowflakeArr = [];
                    messages.forEach(message => {
                        snowflakeArr.push(message.id);
                    });

                    FF.post(`${Config.APIEND}/channels/${this.id}/messages/bulk-delete`, { "messages": snowflakeArr }, { "authorization": `Bot ${this._client.token}` })
                        .then(res => {
                            if (res) {
                                try {
                                    var Response = JSON.parse(res);
                                    if (Response.retry_after) {
                                        return setTimeout(() => this.bulkDelete(amount), Response.retry_after);
                                    }
                                } catch { }
                            }
                            resolve();
                        })
                })

        })
    }
    /* SETTERS */
    edit(obj) {
        obj.parent_id = obj.category_id;
        delete obj.category_id;

        return new Promise((resolve, reject) => {
            FF.patch(`${Config.APIEND}/channels/${this.id}`, obj, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    var Response = JSON.parse(res);
                    if (Response.retry_after) {
                        return setTimeout(() => this.modfiyChannel(key, value), Response.retry_after);
                    }
                    if (Response.message) throw new Error(Response.message);
                    this._default = Response;
                    resolve(this);
                })
        })
    }
    startTyping() {
        return new Promise((resolve, reject) => {
            FF.post(`${Config.APIEND}/channels/${this.id}/typing`, {}, { 'authorization': `Bot ${this._client.token}` })
                .then(res => {
                    if (res) {
                        try {
                            var Response = JSON.parse(res);
                            if (Response.retry_after) {
                                return setTimeout(() => this.startTyping(), Response.retry_after);
                            }
                        } catch { }
                    }
                    resolve();
                });
        })
    }
}

module.exports = TextChannel;

/* HAH CIRCULAR DEPENDENCY WORKAROUND (AM DUMB) */
class Author {
    constructor(client, author) {
        this._username = author.username;
        this._flags = author.public_flags;
        this._id = author.id;
        this._tag = `${author.username}#${author.discriminator}`;
        this._avatarURL = author.avatar ? `${Config.AVATARURL}/${this._id}/${author.avatar}` : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png";
        this._client = client;
        this._bot = author.bot;
    }

    /* GETTERS */
    get username() {
        return this._username;
    }
    get flags() {
        return this._flags;
    }
    get id() {
        return this._id;
    }
    get tag() {
        return this._tag;
    }
    get avatarURL() {
        return this._avatarURL;
    }
    get mention() {
        return `<@${this._id}>`;
    }
    /* ACTIONS */
    send(content) {
        return new Promise((resolve, reject) => {
            FF.post(`${Config.APIEND}/users/@me/channels`, { recipient_id: this._id }, { authorization: `Bot ${this._client.token}` })
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
                                resolve(new Message(this._client, Response, undefined, new TextChannel(this._client, dmchannel)));
                            });
                        // Regular Message
                    } else {
                        FF.post(`${Config.APIEND}/channels/${dmchannel.id}/messages`, content, headers)
                            .then(res => {
                                var Response = JSON.parse(res);
                                if (Response.message) throw new Error(Response.message);
                                resolve(new Message(this._client, Response, undefined, new TextChannel(this._client, dmchannel)));
                            });
                        // Embed
                    }
                })
        })
    }
    // Next Action Here
}
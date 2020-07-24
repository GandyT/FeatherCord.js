/* INTERNAL MODULES */
const Config = require("../Modules/Config.js");
const FF = require("../Modules/FeatherFetch.js");

/* STRUCTURES */
const Message = require("./Message.js");
const TextChannel = require("./TextChannel.js");

class Author {
    constructor(client, author) {
        this._username = author.username;
        this._flags = author.public_flags;
        this._id = author.id;
        this._tag = `${author.username}#${author.discriminator}`;
        this._avatarURL = `${Config.AVATARURL}/${this._id}/${author.avatar}`;
        this._client = client;
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
    // Next Action Here
}

module.exports = Author;
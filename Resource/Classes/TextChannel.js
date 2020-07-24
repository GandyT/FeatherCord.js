/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");
/* STRUCTURES */
const Message = require("./Message.js");

class TextChannel {
    constructor(Client, id) {
        this._id = id;
        this._default = {};
        this._client = Client;
        FF.get(`${Config.APIEND}/channels/${id}`, { "authorization": `Bot ${Client._Memory.get().token}` })
            .then(res => {
                this._default = JSON.parse(res);
            });
    }
    /* GETTERS */
    get id() {
        return this._id;
    }
    get name() {
        return this._default.name;
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


                FF.post(`${Config.APIEND}/channels/${this._id}/messages`, body, headers)
                    .then(res => {
                        var Response = JSON.parse(res);
                        if (Response.message) throw new Error(Response.message);
                        resolve(new Message(this._client, Response, null, this));
                    });
                // Regular Message
            } else {
                FF.post(`${Config.APIEND}/channels/${this._id}/messages`, content, headers)
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
}

module.exports = TextChannel;
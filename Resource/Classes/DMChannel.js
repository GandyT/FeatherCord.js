/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

/* STRUCTURES */
const User = require("./User.js");
const Message = require("./Message.js");

class DMChannel {
    constructor(client, data) {
        // @private
        this._client = client;
        this._data = data;
        this._data.recipients.map((user, index) => {
            this._data.recipients[index] = new User(client, user);
        });
    }
    get id() {
        return this._data.id;
    }
    get dm() {
        return true;
    }
    get users() {
        return this._data.recipients;
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


                FF.post(`${Config.APIEND}/channels/${this._data.id}/messages`, body, headers)
                    .then(res => {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            // Rate Limited
                            return setTimeout(() => this.send(content), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);
                        resolve(new Message(this._client, Response, null, this));
                    });
                // Regular Message
            } else {
                FF.post(`${Config.APIEND}/channels/${this._data.id}/messages`, content, headers)
                    .then(res => {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            // Rate Limited
                            return setTimeout(() => this.send(content), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);

                        resolve(new Message(this._client, Response, null, this));
                    });
                // Embed
            }
        })
    }
}

module.exports = DMChannel;
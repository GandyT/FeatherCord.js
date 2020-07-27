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
        this._default = data;
        this._default.recipients.map((user, index) => {
            this._default.recipients[index] = new User(client, user);
        });
    }
    get id() {
        return this._default.id;
    }
    get dm() {
        return true;
    }
    get users() {
        return this._default.recipients;
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
}

module.exports = DMChannel;
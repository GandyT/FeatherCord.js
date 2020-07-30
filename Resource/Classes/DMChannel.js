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
    send(content) {
        return new Promise((resolve, reject) => {

            if (!content) throw "Specify Message Content";
            var headers = {
                authorization: `Bot ${this._client.token}`
            }
            if (content.file) {
                // File
                var formData = {
                    name: content.file,
                    content: Fs.createReadStream(content.file)
                }
                FF.post(`${Config.APIEND}/channels/${this._default.id}/messages`, {}, headers, content.file ? formData : null)
                    .then(res => {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            // Rate Limited
                            return setTimeout(() => this.send(content), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);
                        resolve(new Message(this._client, Response, null, this, this.guild));
                    });
            } else if (!content.embed) {
                content = String(content);
                if (content.length > 2000) throw new Error("2000 character limit for text messages");
                var body = {
                    content: content,
                    tts: false,
                    embed: {},
                }

                FF.post(`${Config.APIEND}/channels/${this._default.id}/messages`, body, headers, content.file ? formData : null)
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
                let embedbody = {}
                if (content.embed.title) embedbody.title = content.embed.title;
                if (content.embed.color) embedbody.color = content.embed.color;
                if (content.embed.url) embedbody.url = content.embed.url;
                if (content.embed.description) embedbody.description = content.embed.description;
                if (content.embed.fields) embedbody.fields = content.embed.fields;
                if (content.embed.thumbnail) embedbody.thumbnail = content.embed.thumbnail;
                if (content.embed.image) embedbody.image = content.embed.image;
                if (content.embed.footer) embedbody.footer = content.embed.footer;
                if (content.embed.author) embedbody.author = content.embed.author;

                FF.post(`${Config.APIEND}/channels/${this._default.id}/messages`, { embed: embedbody }, headers)
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
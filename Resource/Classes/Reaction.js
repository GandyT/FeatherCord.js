/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

class Reaction {
    constructor(client, data, message) {
        this._message = message;
        this._userid = message.author.id;
        this._client = client;
        this._data = data;
    }
    get name() {
        return this._data.name;
    }
    get message() {
        return this._message;
    }
    delete() {
        return new Promise((resolve, reject) => {
            FF.delete(`${Config.APIEND}/channels/${this._message.channel.id}/messages/${this._message.id}/reactions/${encodeURI(this._data.name)}/${this._userid}`, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    if (res) {
                        try {
                            var Response = JSON.parse(res);
                            if (Response.retry_after) {
                                return setTimeout(() => this.react(emoji), Response.retry_after);
                            }
                        } catch { }
                    }
                    resolve();
                });
        });
    }
}

module.exports = Reaction;
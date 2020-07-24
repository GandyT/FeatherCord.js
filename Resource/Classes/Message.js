/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

class Message {
    constructor(client, data, author, channel) {
        this._client = client;
        this._content = data.content;
        this._channel = channel;
        this._id = data.id;
        this._author = author;
    }
    get content() {
        return this._content;
    }
    get channel() {
        return this._channel;
    }
    get id() {
        return this._id;
    }
    get author() {
        return this._author;
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
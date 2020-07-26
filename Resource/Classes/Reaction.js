/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

class Reaction {
    constructor(message, EncodedEmoji, UserID, client) {
        this._message = message;
        this._encoded = EncodedEmoji;
        this._userid = UserID;
        this._client = client;
    }
    get name() {
        return decodeURI(this._encoded);
    }
    get message() {
        return this._message;
    }
    delete() {
        FF.delete(`${Config.APIEND}/channels/${this._message.channel.id}/messages/${this._message.id}/reactions/${this._encoded}/${this._userid}`, { "authorization": `Bot ${this._client.token}` });
    }
}

module.exports = Reaction;
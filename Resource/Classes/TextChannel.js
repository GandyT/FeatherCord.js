const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");
const Memory = require("../Modules/Memory.js");

class TextChannel {
    constructor(Client, id) {
        this._id = id;
        this._default = {};
        this._client = Client;
        FF.get(`${Config.APIEND}/channels/${id}`, { "authorization": `Bot ${Client.Memory.get().token}` })
            .then(res => {
                this._default = JSON.parse(res);
            });
    }
    get id() {
        return this._id;
    }
    get name() {
        FF.get(`${config.APIEND}/channels/${this._id}`)
            .then(res => {
                console.log(res);
            });
    }
    send(content) {
        if (!content) throw "Specify Message Content";
        if (!content.embed) {
            content = String(content);
            if (content.length > 2000) throw "2000 character limit for text messages";
            // Regular Message
        } else {

            // Embed
        }
    }
}

module.exports = TextChannel;
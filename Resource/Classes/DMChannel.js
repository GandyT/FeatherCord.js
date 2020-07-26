/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

/* STRUCTURES */
const User = require("./User.js");

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
}

module.exports = DMChannel;
/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

class Role {
    constructor(client, data) {
        this._client = client;
        this._data = data;
    };
    /* GETTERS */
    get id() {
        return this._data.id;
    }
    get name() {
        return this._data.name;
    }
    get color() {
        return "#" + this._data.color.toString(16);
    }
    get position() {
        return this._data.position;
    }
    get permissions() {
        var permArr = [];
        for (let [key, value] of Object.entries(Config.PERMS))
            if (this._data.permissions & value)
                permArr.push(key);
        return permArr;
    }
    /* ACTIONS */
    edit(options) {
        /* 
        name: string,
        permissions: array of perm names,
        color: hex or rgb value
        hoist: bool (should the role be displayed separately in the side bar)
        mentionable: bool
        */
        if (Array.isArray(options.permissions)) {
            var int = 0;
            for (let perm in options.permissions) {
                int = int | Config.PERMS[perm.toLowerCase()];
            }
            options.permissions = int;
        }
        if (options.color.charAt(0) == "#") {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(options.color);
            options.color = `${parseInt(result[1], 16)}${parseInt(result[2], 16)}${parseInt(result[3], 16)}`;
        }

        FF.patch(`${Config.APIEND}/guilds/${this._data.guild_id}/roles/${this.id}`, options, { "authorization": `Bot ${this._client.token}` })
            .then(res => {
                var Response = JSON.parse(res);
                if (Response.retry_after) {
                    return setTimeout(() => this.edit(options), Response.retry_after);
                }
                if (Response.message) throw new Error(Response.message);
                resolve(new Role(this._client, Response));
            });
    }
    delete() {
        return new Promise((resolve, reject) => {
            FF.delete(`${Config.APIEND}/guilds/${this._data}.guild_id/roles/${this.id}`, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    var Response = JSON.parse(res);
                    if (Response.retry_after) {
                        return setTimeout(() => this.delete(), Response.retry_after);
                    }
                    if (Response.message) return new Error(Response.message);
                    resolve();
                });
        });
    }
}

module.exports = Role;
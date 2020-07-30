/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");
const Role = require("./Role.js");

class Member {
    constructor(client, data) {
        this._client = client;
        this._data = data;
    }
    /* GETTERS */
    get user() {
        return this._data.user;
    }
    get id() {
        return this._data.user.id
    }
    get roles() {
        return this._data.roles.map(id => {
            return new Role(this._client, this._client._guilds[this._data.guild_id].roles.find(r => r.id == id));
        });
    }
    get nickname() {
        return this._data.nick;
    }
    get guild() {
        this._client._guilds[this._data.guild_id];
    }
    get joined() {
        return this._data.joined_at;
    }
    get muted() {
        return this._data.mute;
    }
    get deaf() {
        return this._data.deaf;
    }
    /* ACTIONS */
    setNickname(nickname) {
        nickname = String(nickname);
        return new Promise((resolve, reject) => {
            FF.patch(`${Config.APIEND}/guilds/${this._data.guild_id}/members/${this.id}`, { nick: nickname }, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    try {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            return setTimeout(() => this.setNickname(nickname), Response.retry_after);
                        }
                    } catch { }
                    resolve(this);
                })
        });
    }
    mute(bool) {
        return new Promise((resolve, reject) => {
            FF.patch(`${Config.APIEND}/guilds/${this._data.guild_id}/members/${this.id}`, { mute: bool }, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    try {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            return setTimeout(() => this.mute(bool), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);
                    } catch { }
                    this._data.mute = bool;
                    resolve(this);
                })
        });
    }
    deaf(bool) {
        return new Promise((resolve, reject) => {
            FF.patch(`${Config.APIEND}/guilds/${this._data.guild_id}/members/${this.id}`, { deaf: bool }, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    try {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            return setTimeout(() => this.deaf(bool), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);
                    } catch { }
                    this._data.deaf = bool;
                    resolve(this);
                })
        });
    }
    addRole(id) {
        return new Promise((resolve, reject) => {
            FF.put(`${Config.APIEND}/guilds/${this._data.guild_id}/members/${this.id}/roles/${id}`, {}, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    try {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            return setTimeout(() => this.addRole(id), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);
                    } catch { }
                    resolve();
                })
        })
    }
    removeRole(id) {
        return new Promise((resolve, reject) => {
            FF.delete(`${Config.APIEND}/guilds/${this._data.guild_id}/members/${this.id}/roles/${id}`, { "authorization": `Bot ${this._client.token}` })
                .then(res => {
                    try {
                        var Response = JSON.parse(res);
                        if (Response.retry_after) {
                            return setTimeout(() => this.removeRole(id), Response.retry_after);
                        }
                        if (Response.message) throw new Error(Response.message);
                    } catch { }
                    resolve();
                })
        })
    }
}

module.exports = Member;
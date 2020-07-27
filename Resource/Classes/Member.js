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
        return this._data.roles;
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
}

module.exports = Member;
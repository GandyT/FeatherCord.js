class Command {
    constructor(Aliases, permissions, Callback) {
        this._aliases = Aliases;
        this.Callback = Callback;
        this._client = undefined;
        this._permissions = permissions;
        this._listen = [];
    }
    get Aliases() {
        return this._aliases;
    }
}

module.exports = Command;
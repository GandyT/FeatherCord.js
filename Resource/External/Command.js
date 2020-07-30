class Command {
    constructor(Aliases, Callback) {
        this._aliases = Aliases;
        this.Callback = Callback;
        this._client = undefined;
        this.listening = {};
        this._permissions = {};
        this._listen = [];
    }
    get Aliases() {
        return this._aliases;
    }

    listen(callback) {
        this._listen.push(callback);
        return this;
    }
}

module.exports = Command;
class Guild {
    constructor(client, id) {
        this._client = client;
        this._id = id;
    }
    get id() {
        return this._id;
    }
}
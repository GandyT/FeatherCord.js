class Message {
    constructor(content, channel, id, author) {
        this._content = content;
        this._channel = channel;
        this._id = id;
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
}

module.exports = Message;
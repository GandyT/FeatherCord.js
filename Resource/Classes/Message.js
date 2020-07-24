/* STRUCTURES */
const TextChannel = require("./TextChannel.js");
const Author = require("./Author.js");

class Message {
    constructor(client, data) {
        this._content = data.content;
        this._channel = new TextChannel(client, data.channel_id);
        this._id = data.id;
        this._author = new Author(client, data.author);
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
/* STRUCTURES */
const Message = require("../Classes/Message.js");
const Author = require("../Classes/Author.js");
const TextChannel = require("../Classes/TextChannel.js");

module.exports = {
    receive(client, payload) {
        // Escape from ``` ``` or ** ** (discord styling)
        const data = payload.d;
        const Event = payload.t;

        if (Event == "MESSAGE_DELETE")
            return client.emit("messagedelete", {
                id: data.id,
                channel: new TextChannel(client, data.channel_id),
            })

        var author = new Author(client, data.author);
        var channel = new TextChannel(client, data.channel_id);
        var SentMessage = new Message(client, data, author, channel);

        /* MORE EVENT MANAGEMENT */
        if (Event == "MESSAGE_CREATE")
            return client.emit("message", SentMessage);


    }
}

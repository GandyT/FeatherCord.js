const Message = require("../Classes/Message.js");
const TextChannel = require("../Classes/TextChannel.js");

module.exports = {
    receive(client, payload) {
        // Escape from ``` ``` or ** ** (discord styling)
        var data = payload.d;
        var channel = new TextChannel(client, data.channel_id);
        var FFMessage = new Message(data.content, channel, data.id, data.author);
        if (client._message)
            client._message(FFMessage);
    }
}

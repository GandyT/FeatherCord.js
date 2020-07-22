const Message = require("../Classes/Message.js");

module.exports = {
    receive(client, payload) {
        // Escape from ``` ``` or ** ** (discord styling)
        var data = payload.d;
        var FFMessage = new Message(data.content, { id: data.channel_id }, data.id, data.author);
        if (client._message)
            client._message(FFMessage);
    }
}

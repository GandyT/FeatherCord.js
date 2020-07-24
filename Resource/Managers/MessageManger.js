/* STRUCTURES */
const Message = require("../Classes/Message.js");

module.exports = {
    receive(client, payload) {
        // Escape from ``` ``` or ** ** (discord styling)
        const data = payload.d;
        const Event = payload.t;

        var SentMessage = new Message(client, data);

        /* MORE EVENT MANAGEMENT */
        if (Event == "MESSAGE_CREATE")
            return client.emit("message", SentMessage);
    }
}

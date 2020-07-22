const MessageManager = require("./MessageManger.js");

class EventManager {
    constructor(client) {
        this.client = client;
    }

    receive(payload) {
        switch (payload.t) {
            case "MESSAGE_CREATE":
                MessageManager.receive(this.client, payload);
                break;
        }
    }
}

module.exports = EventManager;
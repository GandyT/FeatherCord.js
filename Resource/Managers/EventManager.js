/* MANAGERS */
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
            case "READY":
                if (this.client._ready && !this.client._loggedin) {
                    this.client._loggedin = true;
                    this.client._ready();
                }
                break;
        }
    }
}

module.exports = EventManager;
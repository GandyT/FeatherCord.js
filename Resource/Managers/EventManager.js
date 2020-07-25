/* MANAGERS */
const Ready = require("./Ready.js");
const MessageManager = require("./MessageManger.js");

class EventManager {
    constructor(client) {
        this.client = client;
    }

    receive(payload) {
        switch (payload.t) {
            case "MESSAGE_CREATE":
            case "MESSAGE_DELETE":
                MessageManager.receive(this.client, payload);
                break;
            case "READY":
                if (this.client._ready && !this.client._loggedin) {
                    this.client._loggedin = true;
                    Ready(this.client);
                    this.client._ready();
                }
                break;
        }
    }
}

module.exports = EventManager;
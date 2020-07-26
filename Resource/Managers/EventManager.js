/* MANAGERS */
const Ready = require("./Ready.js");
const MessageManager = require("./MessageManger.js");
const ChannelManager = require("./ChannelManager.js");

class EventManager {
    constructor(client) {
        this.client = client;
    }

    receive(payload) {
        switch (payload.t) {
            case "MESSAGE_CREATE":
            case "MESSAGE_DELETE":
            case "MESSAGE_REACTION_ADD":
                MessageManager.receive(this.client, payload);
                break;
            case "READY":
                if (this.client._ready && !this.client._loggedin) {
                    Ready(this.client);
                }
                break;
            case "CHANNEL_DELETE":
            case "CHANNEL_CREATE":
                ChannelManager.receive(this.client, payload);
                break;
        }
    }
}

module.exports = EventManager;
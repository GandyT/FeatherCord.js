/* MANAGERS */
const Ready = require("./Ready.js");
const MessageManager = require("./MessageManger.js");
const ChannelManager = require("./ChannelManager.js");
const MemberManager = require("./GuildMemberManager.js");
const GuildManager = require("./GuildManager.js");

class EventManager {
    constructor(client) {
        this.client = client;
    }

    receive(payload) {
        console.log(payload.t);
        switch (payload.t) {
            case "MESSAGE_CREATE":
            case "MESSAGE_DELETE":
            case "MESSAGE_REACTION_ADD":
                MessageManager.receive(this.client, payload);
                break;
            case "READY":
                if (this.client._ready && !this.client._loggedin)
                    Ready(this.client);
                break;
            case "CHANNEL_DELETE":
            case "CHANNEL_CREATE":
                ChannelManager.receive(this.client, payload);
                break;
            case "GUILD_MEMBER_REMOVE":
            case "GUILD_MEMBER_ADD":
                MemberManager.receive(this.client, payload);
                break;
            case "GUILD_CREATE":
                GuildManager.receive(this.client, payload);
                break;
        }
    }
}

module.exports = EventManager;
/* MANAGERS */
const Ready = require("./Ready.js");
const MessageManager = require("./MessageManger.js");
const ChannelManager = require("./ChannelManager.js");
const MemberManager = require("./GuildMemberManager.js");
const GuildManager = require("./GuildManager.js");
const PresenceManager = require("./PresenceManager.js");
const RoleManager = require("./RoleManager.js");

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
                if (this.client._ready && !this.client._loggedin)
                    Ready(this.client);
                break;
            case "CHANNEL_DELETE":
            case "CHANNEL_CREATE":
            case "CHANNEL_UPDATE":
                ChannelManager.receive(this.client, payload);
                break;
            case "GUILD_MEMBER_REMOVE":
            case "GUILD_MEMBER_ADD":
            case "GUILD_MEMBER_UPDATE":
                MemberManager.receive(this.client, payload);
                break;
            case "GUILD_CREATE":
                GuildManager.receive(this.client, payload);
                break;
            case "PRESENCE_UPDATE":
                PresenceManager.receive(this.client, payload);
                break;
            case "GUILD_ROLE_CREATE":
            case "GUILD_ROLE_UPDATE":
            case "GUILD_ROLE_DELETE":
                RoleManager.receive(this.client, payload)
                break;
        }
    }
}

module.exports = EventManager;
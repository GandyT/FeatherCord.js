/* STRUCTURES */
const Guild = require("../Classes/Guild.js");
const Member = require("../Classes/Member.js");
const TextChannel = require("../Classes/TextChannel.js");
const User = require("../Classes/User.js");

module.exports = {
    "receive": function (client, payload) {
        const Event = payload.t;
        var Data = payload.d;
        if (Event == "GUILD_CREATE") {
            /* DATA MODIFICATION/FORMATTING */
            Data.members = Data.members.map(member => {
                member.user = new User(client, member.user);
                member.guild_id = Data.id;
                return new Member(client, member);
            });
            var categories = [];
            Data.channels = Data.channels.map(channel => {
                if (channel.type == 0) {
                    return new TextChannel(client, channel);
                } else if (channel.type == 4) {
                    categories.push(channel);
                }
            });
            Data.channels = Data.channels.filter(c => c);
            // Did Role Management Internally for some reason

            var guild = new Guild(this, Data);
            guild._categories = categories;

            if (!client._guilds[Data.id])
                client._guilds[Data.id] = guild;
            if (client.loggedin)
                client.emit("guildcreate", guild);
        } else {
            // Guild Remove
            delete client._guilds[Data.id];
            client.emit("guildremove", Data);
        }
    }
}
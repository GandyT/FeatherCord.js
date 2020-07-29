/* STRUCTURES */
const Member = require("../Classes/Member.js");
const User = require("../Classes/User.js");

module.exports = {
    "receive": function (client, payload) {
        var Data = payload.d;
        var Event = payload.t;

        /* MODIFICATIONS */
        Data.guild = client._guilds[Data.guild_id];

        if (Event == "GUILD_MEMBER_ADD") {
            Data.user = new User(client, Data.user);
            let guildMember = new Member(client, Data);
            client._guilds[Data.guild_id]._data.members.push(guildMember)
            client.emit("guildmemberadd", guildMember);
        } else if (Event == "GUILD_MEMBER_REMOVE") {
            // Guild Member Bye Bye
            client._guilds[Data.guild_id]._data.members = client._guilds[Data.guild_id]._data.members.filter(member => member.id != Data.user.id);
            client.emit("guildmemberremove", Data);
        } else if (Event == "GUILD_MEMBER_UPDATE") {
            Data.user = new User(client, Data.user);
            let guildMember = new Member(client, Data);
            var index = client._guilds[Data.guild_id]._data.members.findIndex(m => m.id == Data.user.id);
            client._guilds[Data.guild_id]._data.members[index] = guildMember;
            client.emit("guildmemberupdate", guildMember);
        }
    }
}
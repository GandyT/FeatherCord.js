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
            var guildMember = new Member(client, Data);
            client._guilds[Data.guild_id]._data._members._members.push(guildMember)
            client.emit("guildmemberadd", guildMember);
        } else {
            // Guild Member Bye Bye
            client._guilds[Data.guild_id]._data._members._members = client._guilds[Data.guild_id]._data._members._members.filter(member => member.id != Data.user.id);
            client.emit("guildmemberremove", Data);
        }
    }
}
/* STRUCTURES */
const Role = require("../Classes/Role.js");

module.exports = {
    "receive": function (client, payload) {
        var Data = payload.d;
        var Event = payload.t;

        if (Event == "GUILD_ROLE_CREATE") {
            let role = new Role(client, Data.role);
            client._guilds[Data.guild_id]._data.roles.push(role);
        } else if (Event == "GUILD_ROLE_UPDATE") {
            var index = client._guilds[Data.guild_id]._data.roles.findIndex(r => r.id == Data.role.id);
            let role = new Role(client, Data.role);
            client._guilds[Data.guild_id]._data.roles[index] = role;
        } else {
            // Guild Role Delete
            client._guilds[Data.guild_id]._data.roles = client._guilds[Data.guild_id]._data.roles.filter(r => r.id != Data.role_id);
            client.emit("roledelete", Data);
        }
    }
}
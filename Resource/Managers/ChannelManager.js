/* STRUCTURES */
const TextChannel = require("../Classes/TextChannel.js");

module.exports = {
    "receive": function (client, payload) {
        var Data = payload.d;
        var Event = payload.t;
        console.log(Data);
        if (!Data["guild_id"]) return;

        if (Event == "CHANNEL_CREATE") {
            let newChannel = new TextChannel(client, Data);
            client._guilds[Data.guild_id]._data.channels.push(newChannel);
            client.emit("channelcreate", newChannel);
        } else if (Event == "CHANNEL DELETE") {
            // CHANNEL DELETE
            client._guilds[Data.guild_id]._data.channels = client._guilds[Data.guild_id].channels.filter(c => c.id !== Data.id);
            client.emit("channeldelete", Data);
        } else {
            // CHANNEL UPDATE
            var index = client._guilds[Data.guild_id]._data.channels.findIndex(c => c.id == Data.id);
            let newChannel = new TextChannel(client, Data);
            client._guilds[Data.guild_id]._data.channels[index] = newChannel;
            client.emit("channelupdate", newChannel)
        }
    }
}
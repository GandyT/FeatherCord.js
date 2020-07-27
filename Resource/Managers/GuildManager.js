module.exports = {
    "receive": function (client, payload) {
        const Event = payload.t;
        var Data = payload.d;
        if (Event == "GUILD_CREATE") {
            if (client._guilds[Data.guild_id]) return;
        } else {
            // Guild Remove
        }
    }
}
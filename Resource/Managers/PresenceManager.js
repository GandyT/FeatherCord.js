/* STRUCTURES */
const Guild = require("../Classes/Guild.js");

module.exports = {
    "receive": function (client, payload) {
        var Data = payload.d;
        var Event = payload.t;

        if (Event == "PRESENCE_UPDATE") {
            Data.guild = new Guild(client, client._guilds.find(g => g.id == Data.guild_id));
            client.emit("presenceupdate", Data);
        }
    }
}
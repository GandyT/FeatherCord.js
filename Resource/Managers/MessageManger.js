/* STRUCTURES */
const Message = require("../Classes/Message.js");
const Author = require("../Classes/Author.js");
const TextChannel = require("../Classes/TextChannel.js");
const DMChannel = require("../Classes/DMChannel.js");

/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

module.exports = {
    async receive(client, payload) {
        // Escape from ``` ``` or ** ** (discord styling)
        const data = payload.d;
        const Event = payload.t;

        /* VARIABLES */
        var author = new Author(client, data.author);
        var channel;
        if (!data.guild_id) {
            await FF.get(`${Config.APIEND}/channels/${data.channel_id}`, { "authorization": `Bot ${client.token}`, 'recipient_id': data.author.id })
                .then(res => {
                    const Response = JSON.parse(res);
                    if (Response.message) throw new Error(Response.message);
                    channel = new DMChannel(client, Response)
                });
        } else {
            channel = new TextChannel(client, client.findChannel(c => c.id == data.channel_id))
        }

        /* MORE EVENT MANAGEMENT */
        if (Event == "MESSAGE_CREATE") {
            var SentMessage = new Message(client, data, author, channel);
            return client.emit("message", SentMessage);
        }
        if (Event == "MESSAGE_DELETE") {
            return client.emit("messagedelete", { id: data.id, channel: channel });
        }

    }
}

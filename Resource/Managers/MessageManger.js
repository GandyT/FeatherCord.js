/* STRUCTURES */
const Message = require("../Classes/Message.js");
const Author = require("../Classes/Author.js");
const TextChannel = require("../Classes/TextChannel.js");
const DMChannel = require("../Classes/DMChannel.js");
const Reaction = require("../Classes/Reaction.js");

/* INTERNAL MODULES */
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

module.exports = {
    async receive(client, payload) {
        // Escape from ``` ``` or ** ** (discord styling)
        const data = payload.d;
        const Event = payload.t;

        /* VARIABLES */

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
            let author = new Author(client, data.author);
            let SentMessage = new Message(client, data, author, channel);
            return client.emit("message", SentMessage);
        }
        if (Event == "MESSAGE_DELETE") {
            return client.emit("messagedelete", { id: data.id, channel: channel });
        }
        if (Event == "MESSAGE_REACTION_ADD") {
            let reactionMessage = new Message(client, data, new Author(client, data.member.user), channel);
            return client.emit("reactionadd", new Reaction(client, { name: data.emoji.name }, reactionMessage));
        }
    }
}

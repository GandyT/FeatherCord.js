/* STRUCTURES */
const Message = require("../Classes/Message.js");
const Author = require("../Classes/Author.js");
const User = require("../Classes/User.js");
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
        var guild;
        if (!data.guild_id) {
            await FF.get(`${Config.APIEND}/channels/${data.channel_id}`, { "authorization": `Bot ${client.token}`, 'recipient_id': data.author.id })
                .then(res => {
                    const Response = JSON.parse(res);
                    if (Response.message) throw new Error(Response.message);
                    channel = new DMChannel(client, Response)
                });
        } else {
            guild = client.guilds.find(g => g.id == data.guild_id);
            channel = guild.channels.find(c => c.id == data.channel_id);
        }

        if (data.mentions) {
            data.mentions.map((mention, index) => {
                data.mentions[index] = new User(client, mention);
            });

            /* ARRAY PROTOTYPE */
            var ArrayPrototype = JSON.parse(JSON.stringify(Array.prototype));
            ArrayPrototype.first = function () {
                return this[0];
            }
            ArrayPrototype.last = function () {
                return this[this.length - 1];
            }
            Object.setPrototypeOf(data.mentions, ArrayPrototype);
            Object.setPrototypeOf(data.mention_roles, ArrayPrototype);
        }

        /* MORE EVENT MANAGEMENT */
        if (Event == "MESSAGE_CREATE") {
            let author = new Author(client, data.author);
            let SentMessage = new Message(client, data, author, channel, guild);
            if (author.bot) {
                return;
            };

            let Environment = {
                client: client,
                message: SentMessage,
                args: SentMessage.content.substr(client.prefix.length).toLowerCase().split(" "),
            };
            if (client._listen[author.id]) {
                client._listen[author.id](Environment);
                delete client._listen[author.id];
            }
            client._commands.forEach(command => {
                if (command.listening[author.id]) {
                    command._listen[command.listening[author.id] - 1](Environment);
                    if (command.listening[author.id] == command._listen.length) {
                        delete command.listening[author.id];
                    } else {
                        command.listening[author.id]++;
                    }
                }
                if (client._commands.length && client.prefix && SentMessage.content.startsWith(client.prefix)) {
                    if (command.Aliases.includes(Environment.args[0])) {
                        command.Callback(Environment);
                        if (command._listen.length) {
                            command.listening[author.id] = 1;
                        }
                    }
                }
                return command;
            });

            return client.emit("message", SentMessage);
        }
        if (Event == "MESSAGE_DELETE") {
            return client.emit("messagedelete", { id: data.id, channel: channel, guild: guild });
        }
        if (Event == "MESSAGE_REACTION_ADD") {
            let reactionMessage = new Message(client, data, new Author(client, data.member.user), channel, guild);
            return client.emit("reactionadd", new Reaction(client, { name: data.emoji.name }, reactionMessage));
        }
    }
}

/* INTERNAL MODULES*/
const FF = require("../Modules/FeatherFetch.js");
const RequestMembers = require("../Client/websocket/requestmembers.js");
const Config = require("../Modules/Config.js");

/* STRUCTURES */
const MemberArr = require("../Classes/MemberArr.js");
const TextChannel = require("../Classes/TextChannel.js");
const Guild = require("../Classes/Guild.js");

function Ready(client) {

    // Store Guilds in Cache
    FF.get(`${Config.APIEND}/users/@me/guilds`, { 'authorization': `Bot ${client.token}` })
        .then(res => {
            var Response = JSON.parse(res);
            Response.map(guild => {
                client._guilds[guild.id] = new Guild(client, guild);
                client._guilds[guild.id]._data._members = new MemberArr(client);
                client._guilds[guild.id]._data._channels = [];

                FF.get(`${Config.APIEND}/guilds/${guild.id}/channels`, { "authorization": `Bot ${client.token}` })
                    .then(channels => {
                        var Channels = JSON.parse(channels);
                        var Categories = [];
                        Channels.map(channel => {
                            if (channel.type == 0 || 1) {
                                // Text or Voice Channel
                                if (channel.parent_id) {
                                    var category = Categories.find(c => c.id == channel.parent_id)
                                    channel.category = category;
                                }
                                client._guilds[guild.id]._data._channels.push(new TextChannel(client, channel));
                            } else if (channel.type == 4) {
                                // Category
                                Categories.push(channel);
                            }
                        });

                        client._guilds[guild.id]._categories = Categories;
                    })
                RequestMembers(client, guild.id);
            })
        })
        .then(() => {
            client._ready();
            client._loggedin = true;
        });
}

module.exports = Ready;
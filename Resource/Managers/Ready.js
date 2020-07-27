/* INTERNAL MODULES*/
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");

function isReady(client, Response) {
    return new Promise((resolve, reject) => {
        if (Object.keys(client._guilds).length < Response.length) {
            return setTimeout(() => isReady(client, Response), 500);
        }
        resolve();
    });
}

function Ready(client) {
    // Store Guilds in Cache
    FF.get(`${Config.APIEND}/users/@me/guilds`, { 'authorization': `Bot ${client.token}` })
        .then(res => {
            var Response = JSON.parse(res);
            isReady(client, Response)
                .then(() => {
                    client._ready();
                    client._loggedin = true;
                });
        });
}

module.exports = Ready;
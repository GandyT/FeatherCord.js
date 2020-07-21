/* INTERNAL MODULES */
const Memory = require("../Modules/Memory.js");
const FF = require("../Modules/FeatherFetch.js");
const Config = require("../Modules/Config.js");
const WebSocket = require("../Client/websocket/WebSocket.js");

/* CLASSES */
const TextChannel = require("../Classes/TextChannel.js");

class Client {
    constructor() {
        this.acctype = "bot";
        this.Memory = new Memory;
        this.gateway = undefined;
    }

    // Get Channel by ID
    getChannel(id) {
        return new TextChannel(this, id);
    }
    // Sets Token in memory for later authorization
    login(token) {
        if (!token) throw "Please specify a login token";
        if (this.gateway) throw "Connection already established";
        return new Promise((resolve, reject) => {
            FF.get(`${Config.APIEND}/users/@me`, { "authorization": `Bot ${token}` })
                .then(res => {
                    var Response = JSON.parse(res);
                    if (!Response.bot) throw "Invalid Token";
                    this.Memory.set({ token: token });

                    FF.get(`${Config.APIEND}/gateway/bot`, { "authorization": `Bot ${token}` })
                        .then(res => {
                            var Response = JSON.parse(res);
                            this.gateway = new WebSocket(Response.url, token);
                            resolve();
                        })
                });
        });

    }
}

module.exports = Client;
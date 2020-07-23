const FF = require("../../Modules/FeatherFetch.js");
const Config = require("../../Modules/Config.js");
const WebSocket = require("../websocket/WebSocket.js");

/* CONNECT TO DISCORD GATEWAY */
function login(token) {
    if (!token) throw "Please specify a login token";
    if (this.gateway) throw "Connection already established";
    return new Promise((resolve, reject) => {
        FF.get(`${Config.APIEND}/users/@me`, { "authorization": `Bot ${token}` })
            .then(res => {
                var Response = JSON.parse(res);
                if (!Response.bot) throw "Invalid Token";
                this._Memory.set({ token: token });

                FF.get(`${Config.APIEND}/gateway/bot`, { "authorization": `Bot ${token}` })
                    .then(res => {
                        var Response = JSON.parse(res);
                        this._gateway = new WebSocket(Response.url, token, this);
                        resolve();
                    });
            });
    });
}


module.exports = login;
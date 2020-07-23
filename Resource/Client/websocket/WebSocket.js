/* EXTERNAL MODULES */
const ws = require("ws");

/* CALLBACK MODULES */
const MessageCallBack = require("./MessageCallBack.js");
const CloseCallBack = require("./CloseCallBack.js");

class WebSocket {
    constructor(api, token, client) {
        /* VARIABLES */
        this.api = api;
        this.token = token;
        this.client = client;
        this.reconnecting = false;

        /* SOCKET */
        this.socket = new ws(api);
        this.socket.on("close", CloseCallBack.bind(this));
        this.socket.on("message", MessageCallBack.bind(this));
    }
}

module.exports = WebSocket;
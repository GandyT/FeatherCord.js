const MessageCallBack = require("./MessageCallBack.js");
const ws = require("ws");

function WebSocketClose(code, reason) {
    // Attempt Reconnection
    var sessionid = this.client._Memory.get().sessionid;
    if (!sessionid) throw new Error(`Disconnect: ${reason}, code: ${code}`);

    this.socket = new ws(this.api);
    this.socket.on("message", MessageCallBack.bind(this));
    this.socket.on("close", WebSocketClose.bind(this));
    this.reconnnecting = true;
}

module.exports = WebSocketClose;
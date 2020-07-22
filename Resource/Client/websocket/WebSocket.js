const ws = require("ws");

function HeartBeat(ms, socket, payload) {
    if (!payload) socket.close();
    var payload = {
        op: 1,
        d: 251
    }

    setTimeout(() => { socket.send(JSON.stringify(payload)) }, ms);
}

class WebSocket {
    constructor(api, token, client) {
        this.socket = new ws(api);
        this.socket.on("open", () => {
            console.log("Connected");
        });
        this.socket.on("message", (data) => {
            var payload = JSON.parse(data); ``

            if (payload.op == 10) {
                // Hello OP Code. Send HeartBeat
                HeartBeat(payload.d.heartbeat_interval, this.socket, payload);
                // Send Identify Payload
                var identify = {
                    "op": 2,
                    "d": {
                        "token": token,
                        "properties": {
                            "$os": "windows",
                            "$browser": "disco",
                            "$device": "disco"
                        }
                    }
                }
                this.socket.send(JSON.stringify(identify));
                return;
            }
            if (payload.t == "READY") {
                // Session Ready
                client._Memory.set({ sessionid: payload.d.session_id });
                return;
            }
            if (payload.op == 0) {
                // Data
                client._eventmanager.receive(payload);
            }

        })
    }
}

module.exports = WebSocket;
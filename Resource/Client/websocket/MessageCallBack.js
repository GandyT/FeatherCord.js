// Keep Connection Alive
function HeartBeat(ms, socket, payload) {
    if (!payload) socket.close();
    var payload = {
        op: 1,
        d: 251
    }

    setTimeout(() => { socket.send(JSON.stringify(payload)) }, ms);
}

function MessageCallBack(data) {
    var payload = JSON.parse(data); ``

    if (payload.op == 10) {
        // Hello OP Code. Send HeartBeat
        HeartBeat(payload.d.heartbeat_interval, this.socket, payload);
        // Send Identify Payload
        var identify = {
            "op": 2,
            "d": {
                "token": this.token,
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
        if (this.reconnecting) {
            var sessionid = this.client._Memory.get().sessionid;
            var options = {
                "op": 6,
                "d": {
                    "token": this.token,
                    "session_id": sessionid,
                    "seq": 1337
                }
            }

            this.socket.send(JSON.stringify(options), (err) => {
                if (err) throw err;
                this.reconnecting = false;
                console.log("SUCCESSFULLY RECONNECTED!");
            });
        } else {
            this.client._eventmanager.receive(payload);
            this.client._Memory.set({ sessionid: payload.d.session_id });
        }
        return;
    }
    if (payload.op == 0) {
        // Data
        this.client._eventmanager.receive(payload);
        return;
    }

}

module.exports = MessageCallBack;
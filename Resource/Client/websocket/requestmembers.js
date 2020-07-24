function requestmembers(socket, id) {
    var payload = {
        "op": 8,
        "d": {
            "guild_id": id,
            "query": "",
            "limit": 0
        }
    }

    socket.send(JSON.stringify(payload));
}

module.exports = requestmembers;
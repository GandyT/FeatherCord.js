function requestmembers(client, id) {
    const socket = client._gateway.socket;
    var payload = {
        "op": 8,
        "d": {
            "guild_id": id,
            "query": "",
            "limit": 0
        }
    }
    client.on(`${id}-members`, (memberchunk) => {
        client._guilds[id].members.concat(memberchunk);
    });
    socket.send(JSON.stringify(payload));
}

module.exports = requestmembers;
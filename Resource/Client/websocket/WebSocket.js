const http = require("http");

class WebSocket {
    constructor(api, token) {
        var Query = api.split("/");
        var hostname = Query[2];

        const server = http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('okay');
        });
        server.on("upgrade", (req, socket, head) => {
            socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
                'Upgrade: WebSocket\r\n' +
                'Connection: Upgrade\r\n' +
                '\r\n');

            socket.pipe(socket); // echo back
        });

        server.listen(443, '127.0.0.1', () => {
            // make a request
            const options = {
                port: 443,
                host: hostname,
                path: "/?v=6&encoding=json",
                headers: {
                    'Connection': 'Upgrade',
                    'Upgrade': 'websocket'
                }
            };
            const req = http.request(options);
            req.end();

            req.on('upgrade', (res, socket, upgradeHead) => {
                console.log('got upgraded!');
                socket.end();
                process.exit(0);
            });
        });
    }
}

module.exports = WebSocket;
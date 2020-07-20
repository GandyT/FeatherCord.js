const https = require("https");

module.exports = {
    "get": async function (api) {
        if (!api) throw "Specify Endpoint";
        return new Promise(async (resolve, reject) => {
            var data = "";
            https.get(api, async (resp) => {

                resp.on("data", (chunk) => {
                    // HTTP sends Data in chunks. Add chunk to form data.
                    data += chunk;
                });

                resp.on("end", () => {
                    resolve(data);
                });
            });
        })

    },
    "post": async function (api, body, headers = {
        'Content-Type': 'application/json',
    }) {

        if (!api) throw "Specify Endpoint";
        if (!body) throw "Specify Body";

        /* VARIABLES */
        const Query = api.split("/");
        const hostname = Query.slice(2, 3)[0];
        const path = Query.slice(3).join("/");
        var port = 80;
        if (api.indexOf("https") != -1) port = 443;

        var options = {
            hostname: hostname,
            path: "/" + path,
            port: port,
            method: "POST",
            headers: headers,
        }
        return new Promise(async (resolve, reject) => {
            const request = https.request(options, (resp) => {
                var data = "";
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                resp.on('end', () => {
                    resolve(data);
                });
            });
            request.write(JSON.stringify(body));
            request.end();
        });
    },
    "put": async function (api, body, headers = {
        'Content-Type': 'application/json',
    }) {
        if (!api) throw "Specify Endpoint";
        if (!body) throw "Specify Body";

        /* VARIABLES */
        const Query = api.split("/");
        const hostname = Query.slice(2, 3)[0];
        const path = Query.slice(3).join("/");
        var port = 80;
        if (api.indexOf("https") != -1) port = 443;

        var options = {
            hostname: hostname,
            port: port,
            path: path,
            method: "PUT",
            headers: headers,
        }
        return new Promise((resolve, reject) => {
            const req = https.request(options, (resp) => {
                var data = "";
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve(data);
                })
            });
            req.write(JSON.stringify(body));
            req.end();
        })
    },
    "delete": async function (api, body, headers = {
        'Content-Type': 'application/json',
    }) {
        if (!api) throw "Specify Endpoint";
        if (!body) throw "Specify Body";

        /* VARIABLES */
        const Query = api.split("/");
        const hostname = Query.slice(2, 3)[0];
        const path = Query.slice(3).join("/");
        var port = 80;
        if (api.indexOf("https") != -1) port = 443;

        var options = {
            hostname: hostname,
            port: port,
            path: path,
            method: "DELETE",
            headers: headers,
        }
        return new Promise((resolve, reject) => {
            const req = https.request(options, (resp) => {
                var data = "";

                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve(data);
                });
            });
            req.write(JSON.stringify(body));
            req.end();
        })
    }
}
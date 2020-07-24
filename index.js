const client = require("./Resource/Client/Client.js");

const Client = new client();

Client.on("ready", () => {
    console.log("Bot is ready");
})

Client.on("message", (msg) => {
    var args = msg.content.split(" ");
    if (args[0] == "password") {
        var channel = Client.getChannel("722622021791645789");
        channel.send("Test");
    }
});

var channel = await Client.channels.find(c => c.id == "722622021791645789");

Client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");




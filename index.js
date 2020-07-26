const client = require("./Resource/Client/Client.js");

const Client = new client();

Client.on("ready", () => {
    console.log("Bot is ready");
})

Client.on("message", async (msg) => {
    var args = msg.content.split(" ");
    if (args[0] == "password") {
        var mentioned = msg.mentions.members.first();
        if (mentioned) mentioned.send("HELLOO");
    }
});

Client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");




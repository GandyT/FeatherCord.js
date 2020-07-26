const Client = require("./Resource/client/client.js");

const client = new Client();

client.on("ready", async () => {
    console.log("Bot is ready");
})

client.on("message", async (msg) => {
    var args = msg.content.split(" ");
    var channel = msg.channel;
    if (msg.author.bot) return;
    console.log(msg.mentions);
});

client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");




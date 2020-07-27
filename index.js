const Client = require("./Resource/client/client.js");
const client = new Client();

client.on("ready", async () => {
    console.log("Bot is ready");
})

client.on("message", async (msg) => {
    if (msg.author.bot) return;
    var channel = msg.channel;
    channel.send({ file: "./test.txt" });
});


client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");
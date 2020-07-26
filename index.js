const Client = require("./Resource/client/client.js");
const client = new Client();

client.on("ready", async () => {
    console.log("Bot is ready");
})

client.on("message", async (msg) => {
    var args = msg.content.split(" ");
    var guild = msg.guild;
    var channel = guild.channels.find(c => c.name.toLowerCase() == "test");
    while (channel) {
        await channel.delete();
        channel = guild.channels.find(c => c.name.toLowerCase() == "test");
    }
});

client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");




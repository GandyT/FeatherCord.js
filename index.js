const Client = require("./Resource/client/client.js");
const client = new Client();

client.on("ready", async () => {
    console.log("Bot is ready");
})

client.on("message", async (msg) => {
    var args = msg.content.split(" ");
    var guild = msg.guild;

    if (msg.author.bot) return;
    var channel = guild.channels.find(c => c.id == "737283411613450331");
    channel.edit({ name: "test", category_id: "737283434015096872" })
        .then(c => {
            c.send("Changing Back!")
            c.edit({ name: "Finished", category_id: null });
        });
});

client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");




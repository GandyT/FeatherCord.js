const Client = require("./Resource/client/client.js");

const client = new Client();

client.on("ready", () => {
    console.log("Bot is ready");
})

client.on("message", async (msg) => {
    var args = msg.content.split(" ");
    msg.react("✅");
});

client.on("reactionadd", async (reaction) => {
    setTimeout(() => { reaction.delete() }, 1000);
});

client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");




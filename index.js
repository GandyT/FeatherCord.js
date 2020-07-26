const client = require("./Resource/Client/Client.js");

const Client = new client();

Client.on("ready", () => {
    console.log("Bot is ready");
})

Client.on("message", async (msg) => {
    var args = msg.content.split(" ");
    if (args[0] == "password") {
        msg.channel.send("HELLO")
            .then(res => {
                res.react("✔️")
                    .then(reaction => {
                        setTimeout(() => { reaction.delete(); msg.channel.send("Reaction Deleted") }, 3000);
                    });
            });
    }
});

Client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");




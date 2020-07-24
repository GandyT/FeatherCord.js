const client = require("./Resource/Client/Client.js");

const Client = new client();

Client.on("ready", () => {
    console.log("Bot is ready");
})

Client.on("message", async (msg) => {
    var args = msg.content.split(" ");
    if (args[0] == "password") {
        var guild = Client.getGuild("722621224038957188");
        var members = await guild.members;
        console.log(members);
    }
});

Client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");




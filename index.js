const Client = require("./Resource/client/client.js");
const Command = require("./Resource/External/Command.js");
var command = new Command(["ping"], (env) => {
    if (env.message.author.bot) return;
    env.message.channel.send("HHEY");
});
command.listen((Env) => {
    Env.message.channel.send(Env.message.content);
});
command.listen((Env) => {
    Env.message.channel.send("Listen #2");
})
const client = new Client();
client.setPrefix("!");
client.addCommand(command);

client.on("ready", async () => {
    console.log("Bot is ready");
});

client.on("message", async (msg) => {
    if (msg.author.bot) return;
});

client.login("NzM0ODcyMjMzNDQ4ODMzMDU0.Xxi3Og.e2MAlb7t5nvClUz33bs_YtWMHjQ");
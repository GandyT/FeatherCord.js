module.exports = {
    ["APIEND"]: "https://discord.com/api",
    ["AVATARURL"]: "https://cdn.discordapp.com/avatars",
    ["PERMS"]: {
        createinvite: 0x1,
        kick: 0x2,
        ban: 0x4,
        administrator: 0x8,
        managechannels: 0x10,
        manageserver: 0x20,
        changenickname: 0x4000000,
        managenicknames: 0x8000000,
        manageroles: 0x10000000,
        managewebhooks: 0x20000000,
        manageemojis: 0x40000000,
        viewauditlog: 0x80,
        // Text
        addreactions: 0x40,
        readmessages: 0x400,
        sendmessages: 0x800,
        sendttsmessages: 0x1000,
        managemessages: 0x2000,
        embedlinks: 0x4000,
        attachfiles: 0x8000,
        readmessagehistory: 0x10000,
        mentioneveryone: 0x20000,
        useexternalemojis: 0x40000,
        // Voice
        viewchannel: 0x400,
        connect: 0x100000,
        speak: 0x200000,
        mute: 0x400000,
        deafen: 0x800000,
        movemembers: 0x1000000,
        usevad: 0x2000000,
        priorityspeaker: 0x100
    }
}
"use strict";
const CommandObjectClass_1 = require("../../Utils/CommandObjectClass");
module.exports = new CommandObjectClass_1.CommandObject({
    name: "ping",
    description: "Pings the bot and returns it's latency UwU",
    callback: async (client, interaction) => {
        await interaction.reply("pong");
    },
    forDevOnly: true,
    deleted: true,
});

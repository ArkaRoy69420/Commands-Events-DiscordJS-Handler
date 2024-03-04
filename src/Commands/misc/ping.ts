import { Client, CommandInteraction } from "discord.js";
import { CommandObject } from "../../Utils/CommandObjectClass";

export = new CommandObject({
    name: "ping",
    description: "Pings the bot and returns it's latency UwU",
    callback: async (client: Client, interaction: CommandInteraction) => {
        await interaction.reply("pong");
        // add the logic you want.
    },
    forDevOnly: true,
    deleted: true, 
    // rest of the code
})
import { Client, Guild, FetchApplicationCommandOptions } from "discord.js";

export default async (client: Client, guildId?: string) => {
    let appCommands;
    if (guildId) {
        const guild: Guild | undefined = await client.guilds.cache.get(guildId);
        appCommands = await guild?.commands;
    } else {
        appCommands = await client.application?.commands;
    }

    appCommands?.fetch({ force: true })
    return appCommands;
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (client, guildId) => {
    let appCommands;
    if (guildId) {
        const guild = await client.guilds.cache.get(guildId);
        appCommands = await guild?.commands;
    }
    else {
        appCommands = await client.application?.commands;
    }
    appCommands?.fetch({ force: true });
    return appCommands;
};

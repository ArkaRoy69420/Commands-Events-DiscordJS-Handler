"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const path = require("path");
const commandsHandler_1 = require("./Handlers/commandsHandler");
const eventsHandler_1 = require("./Handlers/eventsHandler");
require("colors");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.MessageContent,
    ],
});
new eventsHandler_1.default({
    client: client,
    eventsPath: path.join(__dirname, "Events")
});
new commandsHandler_1.default(client, path.join(__dirname, "Commands"), ["DEVELOPER IDS"], "your test server");
client.login(process.env.token).then(() => console.log(`${"[BOT LOGIN]".green} ${"Logged in successfully!".blue}`));

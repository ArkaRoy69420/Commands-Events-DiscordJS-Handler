import { Client, IntentsBitField } from "discord.js";
import "dotenv/config";
import path = require("path");
import CommandsHandler from "./Handlers/commandsHandler";
import eventsHandler from "./Handlers/eventsHandler";
import "colors"

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

new eventsHandler({
    client: client,
    eventsPath: path.join(
        __dirname, "Events"
    )
})

new CommandsHandler(
    client,
    path.join(__dirname, "Commands"),
    ["DEVELOPER IDS"],
    "your test server"

);

client.login(process.env.token).then(() => console.log(`${"[BOT LOGIN]".green} ${"Logged in successfully!".blue}`))
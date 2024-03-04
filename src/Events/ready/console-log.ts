import { Client } from "discord.js";

module.exports = async (client: Client) => {
    console.log(`${"[INFO]".yellow} ${client.user?.username} is now Online and ready to use!`);
};
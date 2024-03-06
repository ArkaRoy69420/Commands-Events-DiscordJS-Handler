"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const compareCommand_1 = require("../Utils/compareCommand");
const getAppCommands_1 = require("../Utils/getAppCommands");
const getLocalCommandFiles_1 = require("../Utils/getLocalCommandFiles");
class CommandsHandler {
    constructor(client, commandsPath, devsId, testGuildId) {
        client.on("ready", async () => {
            const localCommandFiles = (0, getLocalCommandFiles_1.default)(commandsPath);
            const appCommands = await (0, getAppCommands_1.default)(client);
            for (const commandObject of localCommandFiles) {
                const existingCommand = await appCommands?.cache.find((command) => command.name === commandObject.name);
                const name = commandObject.name;
                const description = commandObject.description;
                const options = commandObject.options;
                let registeredCommandNamesArray = [];
                (await client.application?.commands.fetch())?.map((cmd) => {
                    registeredCommandNamesArray.push(cmd.name);
                });
                if (commandObject.deleted &&
                    !registeredCommandNamesArray.includes(commandObject.name)) {
                    console.log(`${"[INFO]".yellow} Skipping command "${commandObject.name} as it is set to deleted."`);
                    continue;
                }
                if (existingCommand &&
                    registeredCommandNamesArray.includes(commandObject.name) &&
                    commandObject.deleted) {
                    await existingCommand.delete().then(() => {
                        console.log(`${"[INFO]".yellow} Deleted command "${name}" globally.`);
                    });
                }
                if (existingCommand &&
                    (0, compareCommand_1.default)(existingCommand, commandObject)) {
                    await appCommands
                        ?.edit(existingCommand.id, {
                        name: name,
                        description: description,
                        options: options,
                    })
                        .then(() => {
                        console.log(`${"[INFO]".yellow} Edited the command "${name} globally."`);
                    });
                }
                if (!existingCommand && !registeredCommandNamesArray.includes(name)) {
                    await appCommands
                        ?.create({
                        name: name,
                        description: description,
                        options: options,
                    })
                        .then(() => {
                        console.log(`${"[INFO]".yellow} The command "${name}" has been registered globally.`);
                    })
                        .catch((error) => {
                        console.error(`${"[ERROR_IN_REGISTRATION]".red} An error occured while creating the command "${name}". Error:\n${error}`);
                    });
                }
            }
        });
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            const localCommands = await (0, getLocalCommandFiles_1.default)(commandsPath);
            const commandObject = localCommands.find(command => command.name === interaction.commandName);
            if (!commandObject)
                return;
            if (!commandObject.dm_permissions && !interaction.inGuild()) {
                await interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle("Sorry bruh")
                            .setDescription("I'm sorry but this command cannot be run in DMs. Nevermind, \ntry it in a server, instead. Maybe it's a better idea!")
                            .setColor("Red")
                            .setFooter({ text: "Aww" }),
                    ],
                });
                return;
            }
            if (commandObject.forDevOnly === true && devsId.includes(interaction.user.id)) {
                let devOnlyEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle("Nah")
                    .setDescription("Nah my human, this command ain't made for 'ta.\nThis command is meant for developers.")
                    .setFooter({ text: `Blud really thinks they can use devOnly command` })
                    .setColor("DarkRed");
                await interaction.editReply({ embeds: [devOnlyEmbed] });
                return;
            }
            if (commandObject.forTestGuildOnly === true && interaction.guild?.id !== testGuildId) {
                const testServerOnlyCommandEmbed = new discord_js_1.EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Nah")
                    .setDescription("This command is only available in the test server/guild.\nIf you believe this is an error or you ARE in the test server, \nkindly talk with the developer about this. Else, go try other \ncommand or mind your own business. ")
                    .setFooter({ text: "Awww man" });
                await interaction.reply({ embeds: [testServerOnlyCommandEmbed], ephemeral: false });
                return;
            }
            if (!interaction.inGuild() && commandObject.botPermissionsRequired?.length === 0) {
                await interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle("Nope")
                            .setDescription("This command is only callable in guilds with the required permissions.")
                            .setFooter({ text: "Go join a server instead" })
                            .setColor("DarkRed")
                    ]
                });
                return;
            }
            if (!interaction.inGuild() && commandObject.userPermissionsRequired?.length === 0) {
                await interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle("Nope")
                            .setDescription("This command is only callable in guilds with the required permissions.")
                            .setFooter({ text: "Go join a server instead" })
                            .setColor("DarkRed")
                    ]
                });
                return;
            }
            const userPermissionsBitFieldNumber = new discord_js_1.PermissionsBitField(interaction.member?.permissions.valueOf()).bitfield;
            const userPermissions = new discord_js_1.PermissionsBitField(userPermissionsBitFieldNumber);
            for (const permission of commandObject.userPermissionsRequired || []) {
                const owner = await interaction.guild?.fetchOwner();
                const allPermissions = new discord_js_1.PermissionsBitField(new discord_js_1.PermissionsBitField(owner?.permissions.valueOf()).bitfield).toArray();
                const permissionName = allPermissions.find(p => p === permission);
                if (!userPermissions.has(permission)) {
                    let noUserPermissionsEmbed = new discord_js_1.EmbedBuilder()
                        .setTitle("Nope")
                        .setDescription(`You aren't allowed to run this command as you don't have the permission "${permissionName}".`)
                        .setFooter({ text: "Aww man" })
                        .setColor("DarkRed");
                    await interaction.reply({
                        embeds: [noUserPermissionsEmbed]
                    });
                    return;
                }
            }
            const bot = interaction.guild?.members.me;
            const botPermissionsBitFieldNumber = new discord_js_1.PermissionsBitField(bot?.permissions.valueOf()).bitfield;
            const botPermissions = new discord_js_1.PermissionsBitField(botPermissionsBitFieldNumber);
            for (const permission of commandObject.botPermissionsRequired || []) {
                const owner = await interaction.guild?.fetchOwner();
                const allPermissions = new discord_js_1.PermissionsBitField(new discord_js_1.PermissionsBitField(owner?.permissions.valueOf()).bitfield).toArray();
                const permissionName = allPermissions.find(p => p === permission);
                if (!botPermissions.has(permission)) {
                    let noBotPermissionsEmbed = new discord_js_1.EmbedBuilder()
                        .setTitle("Nope")
                        .setDescription(`I am not allowed to run this command as I don't have the permissions "${permissionName}"`)
                        .setFooter({ text: "Aww man" })
                        .setColor("DarkRed");
                    await interaction.reply({
                        embeds: [noBotPermissionsEmbed]
                    });
                    return;
                }
            }
            await commandObject.callback(client, interaction);
        });
    }
}
exports.default = CommandsHandler;

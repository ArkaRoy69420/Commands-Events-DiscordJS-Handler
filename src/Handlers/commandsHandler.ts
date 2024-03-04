import { ApplicationCommand, Client, EmbedBuilder, Interaction, PermissionsBitField } from "discord.js";
import compareCommands from "../Utils/compareCommand";
import getAppCommands from "../Utils/getAppCommands";
import getLocalCommandFiles from "../Utils/getLocalCommandFiles";
import { CommandObject } from "../Utils/CommandObjectClass";

export default class CommandsHandler {
  constructor(
    client: Client,
    commandsPath: string,
    devsId: string[],
    testGuildId: string
  ) {
    client.on("ready", async () => {
      // declaring localCommandFiles as an array of CommandObject
      const localCommandFiles = getLocalCommandFiles(
        commandsPath
      ) as CommandObject[];
      const appCommands = await getAppCommands(client); // global commands only.

      /**
       * localCommandFiles is an array of CommandObject blueprint objects.
       * Hence the name, commandObject.
       * Iterate over each CommandObject in the array and work with them to register commands.
       */
      for (const commandObject of localCommandFiles) {
        const existingCommand = await appCommands?.cache.find(
          (command) => command.name === commandObject.name
        );
        // destructuring the commandObject to get name, description and options
        const name = commandObject.name;
        const description = commandObject.description;
        const options = commandObject.options as any;

        let registeredCommandNamesArray: string[] = [];
        (await client.application?.commands.fetch())?.map(
          (cmd: ApplicationCommand) => {
            registeredCommandNamesArray.push(cmd.name);
          }
        );

        if (
          commandObject.deleted &&
          !registeredCommandNamesArray.includes(commandObject.name)
        ) {
          console.log(
            `${"[INFO]".yellow} Skipping command "${commandObject.name} as it is set to deleted."`
          );
          continue;
        }

        if (
          existingCommand &&
          registeredCommandNamesArray.includes(commandObject.name) &&
          commandObject.deleted
        ) {
          await existingCommand.delete().then(() => {
            console.log(`${"[INFO]".yellow} Deleted command "${name}" globally.`);
          });
        }

        if (
          existingCommand &&
          compareCommands(existingCommand, commandObject)
        ) {
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
              console.log(
                `${"[INFO]".yellow} The command "${name}" has been registered globally.`
              );
            })
            .catch((error) => {
              console.error(
                `${"[ERROR_IN_REGISTRATION]".red} An error occured while creating the command "${name}". Error:\n${error}`
              );
            });
        }
      }
    });

    // handling the commands with "interactionCreate" event.
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const localCommands = await getLocalCommandFiles(commandsPath) as CommandObject[];
        
        // main command file in our server
        const commandObject = localCommands.find(command => command.name === interaction.commandName);
        
        if (!commandObject) return;

        if (!commandObject.dm_permissions && !interaction.inGuild()) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Sorry bruh")
                        .setDescription("I'm sorry but this command cannot be run in DMs. Nevermind, \ntry it in a server, instead. Maybe it's a better idea!")
                        .setColor("Red")
                        .setFooter({ text: "Aww" }),
                ],
            })

            return;
        }



        if (commandObject.forDevOnly === true && devsId.includes(interaction.user.id)) {    
            let devOnlyEmbed = new EmbedBuilder()
            .setTitle("Nah")
            .setDescription("Nah my human, this command ain't made for 'ta.\nThis command is meant for developers.")
            .setFooter({ text: `Blud really thinks they can use devOnly command` })
            .setColor("DarkRed");
    
            await interaction.editReply({ embeds: [devOnlyEmbed] });
            return;
        }

        if (commandObject.forTestGuildOnly === true && interaction.guild?.id !== testGuildId) {
            const testServerOnlyCommandEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Nah")
            .setDescription("This command is only available in the test server/guild.\nIf you believe this is an error or you ARE in the test server, \nkindly talk with the developer about this. Else, go try other \ncommand or mind your own business. ")
            .setFooter({ text: "Awww man" });

          await interaction.reply({ embeds: [testServerOnlyCommandEmbed], ephemeral: false });

          return;
        }
        
        /**
         * This checks if any permissions are required by the bot or the user
         * But at the same time, the command is being run in DMs
         * I have added this mainly becoz any command that is made for specific people in a sever will mostly be run in the server
         * So, if user or bot is not in the guild and the command needs specific permissions to run, it'll provide a message
         * It can be removed but that may have consequences
         */
        if (!interaction.inGuild() && commandObject.botPermissionsRequired?.length === 0) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
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
                    new EmbedBuilder()
                        .setTitle("Nope")
                        .setDescription("This command is only callable in guilds with the required permissions.")
                        .setFooter({ text: "Go join a server instead" })
                        .setColor("DarkRed")
                ]
            });

            return;
        }

        /**
         * If we have reached this far, it means the command is in guild and we have permissions to run the command
         * Here starts the checks for them
         */
        const userPermissionsBitFieldNumber: bigint = new PermissionsBitField(
          interaction.member?.permissions.valueOf() as bigint
        ).bitfield;
        const userPermissions = new PermissionsBitField(userPermissionsBitFieldNumber);
        
        for (const permission of commandObject.userPermissionsRequired || []) {
            const owner = await interaction.guild?.fetchOwner();
            const allPermissions = new PermissionsBitField(
                new PermissionsBitField(owner?.permissions.valueOf()).bitfield
            ).toArray();

            const permissionName = allPermissions.find(p => p === permission);
            if (!userPermissions.has(permission)) {
                let noUserPermissionsEmbed = new EmbedBuilder()
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

        const bot = interaction.guild?.members.me; // implies that bot is a member of guild i.e. the interaction is in a guild
        
        const botPermissionsBitFieldNumber = new PermissionsBitField(bot?.permissions.valueOf()).bitfield;
        const botPermissions = new PermissionsBitField(botPermissionsBitFieldNumber);

        for (const permission of commandObject.botPermissionsRequired || []) {
            // look for permission name of this element of botPermissionsRequired array
            // this may be used later in case bot doesn't have the permission required to perform the command
            const owner = await interaction.guild?.fetchOwner();
            const allPermissions = new PermissionsBitField(
                new PermissionsBitField(owner?.permissions.valueOf()).bitfield
            ).toArray();
            
            const permissionName = allPermissions.find(
                p => p === permission
            )

            

            if (!botPermissions.has(permission)) {
                let noBotPermissionsEmbed = new EmbedBuilder()
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

        // all the checks have been successfully passes and therefore, the command logic can now be executed.
        await commandObject.callback(client, interaction);
    })
  }
}

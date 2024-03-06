import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { CommandObject } from "../../Utils/CommandObjectClass";
import "colors";

export = new CommandObject({
  name: "ping",
  description: "Pings the bot and returns it's latency UwU",
  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    try {
      const reply = await interaction.fetchReply();
      const latency: number =
        reply.createdTimestamp - interaction.createdTimestamp;

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Pong! ✍️(◔◡◔)")
            .setDescription("With latencies:")
            .addFields(
              {
                name: "Client ping:",
                value: `${latency}ms`,
              },
              {
                name: "Websocket ping",
                value: `${client.ws.ping}ms`,
              }
            )
            .setColor("Aqua"),
        ],
      });
    } catch (error) {
      console.error(
        `${"[ERROR]".red} Error while running the command ${
          interaction.commandName
        }: \n ${error}`
      );
    }
  },
  forDevOnly: true,
  deleted: false,
  // rest of the code
});

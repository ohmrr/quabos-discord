import { SlashCommandBuilder } from 'discord.js';
import Command from '../interfaces/command';

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows the client ping'),
  execute: async (interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();
    const clientLatency = reply.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply(
      `**Client**: ${clientLatency}ms | **Websocket**: ${interaction.client.ws.ping}ms`,
    );
  },
};

export default ping;

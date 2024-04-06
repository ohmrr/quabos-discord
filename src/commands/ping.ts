import { SlashCommandBuilder } from 'discord.js';
import Command from '../interfaces/command';

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get the client and websocket ping.')
    .setDMPermission(false),
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

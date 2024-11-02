import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import type Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get the client and websocket ping.')
    .setContexts(InteractionContextType.Guild),
  usage: '/ping',
  execute: async interaction => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();
    const clientLatency = reply.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(
      `${emojiMap.celestial.alien} **Client**: ${clientLatency}ms | **Websocket**: ${interaction.client.ws.ping}ms`,
    );
  },
};

export default ping;

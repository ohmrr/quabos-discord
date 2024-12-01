import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import type Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';
import logger from '../utils/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get the client and websocket ping.')
    .setContexts(InteractionContextType.Guild),
  usage: '/ping',
  execute: async interaction => {
    try {
      await interaction.deferReply();

      const reply = await interaction.fetchReply();
      const clientLatency = reply.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply(
        `${emojiMap.alien} **Client**: ${clientLatency}ms | **Websocket**: ${interaction.client.ws.ping}ms`,
      );
    } catch (error) {
      logger.error(error, 'There was an error responding to the interaction');
      interaction.reply({
        content: `${emojiMap.error} There was an error getting the client ping. Please try again later.`,
        ephemeral: true,
      });
    }
  },
} satisfies Command;

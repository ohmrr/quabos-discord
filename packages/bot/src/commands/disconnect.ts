import { getVoiceConnection } from '@discordjs/voice';
import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import type Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';
import logger from '../utils/logger';

export default {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect from the voice channel.')
    .setContexts(InteractionContextType.Guild),
  usage: '/disconnect',
  cooldown: 10_000,
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;

    try {
      const voiceConnection = getVoiceConnection(interaction.guild.id);
      if (!voiceConnection) {
        await interaction.reply({
          content: `${emojiMap.error} I am not in any voice channels.`,
          ephemeral: true,
        });
        return;
      }

      voiceConnection.destroy();
      await interaction.reply(`${emojiMap.success} Disconnected from the voice channel.`);
    } catch (error) {
      logger.error(
        error,
        'There was an error disconnecting from the voice channel and responding to the interaction.',
      );
    }
  },
} satisfies Command;

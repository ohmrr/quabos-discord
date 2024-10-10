import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const disconnect: Command = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect from the voice channel.')
    .setContexts(InteractionContextType.Guild),
  usage: '/disconnect',
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;

    const voiceConnection = getVoiceConnection(interaction.guild.id);
    if (!voiceConnection) {
      await interaction.reply(
        `${emojiMap.error.cross} I am not in any voice channels.`,
      );
      return;
    }

    voiceConnection.destroy();
    await interaction.reply(
      `${emojiMap.success.check} Disconnected from the voice channel.`,
    );
  },
};

export default disconnect;

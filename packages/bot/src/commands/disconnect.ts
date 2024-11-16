import { getVoiceConnection } from '@discordjs/voice';
import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import type Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

export default {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect from the voice channel.')
    .setContexts(InteractionContextType.Guild),
  usage: '/disconnect',
  cooldown: 10_000,
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;

    const voiceConnection = getVoiceConnection(interaction.guild.id);
    if (!voiceConnection) {
      await interaction.reply({
        content: `${emojiMap.error.cross} I am not in any voice channels.`,
        ephemeral: true,
      });
      return;
    }

    voiceConnection.destroy();
    await interaction.reply(`${emojiMap.success.check} Disconnected from the voice channel.`);
  },
} satisfies Command;

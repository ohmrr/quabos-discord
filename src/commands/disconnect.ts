import { SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const disconnect: Command = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect from the voice channel.')
    .setDMPermission(false),
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;

    const voiceConnection = getVoiceConnection(interaction.guild.id);
    if (!voiceConnection) {
      interaction.reply(`${emojiMap.error} I am not in any voice channels.`);
      return;
    }

    voiceConnection.destroy();
    interaction.reply(`${emojiMap.success} Disconnected from the voice channel.`);
  },
};

export default disconnect;

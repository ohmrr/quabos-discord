import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import Command from '../interfaces/command';

const disconnect: Command = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect from the voice channel.')
    .setDMPermission(false),
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;

    const voiceConnection = getVoiceConnection(interaction.guild.id);
    if (!voiceConnection) {
      interaction.reply('No voice connection found.');
      return;
    }

    voiceConnection.destroy();
  },
};

export default disconnect;

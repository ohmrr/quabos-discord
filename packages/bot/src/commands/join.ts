import { joinVoiceChannel } from '@discordjs/voice';
import {
  GuildMember,
  InteractionContextType,
  SlashCommandBuilder,
} from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const join: Command = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join the voice channel.')
    .setContexts(InteractionContextType.Guild),
  usage: '/join',
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;
    const guildMember = interaction.member as GuildMember;
    const voiceChannel = guildMember.voice.channel;

    if (!voiceChannel) {
      await interaction.reply(
        `${emojiMap.error.cross} You are not in a voice channel.`,
      );
      return;
    }

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      selfDeaf: false,
      selfMute: false,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    await interaction.reply(
      `${emojiMap.sound.normal} Joined the voice channel ${voiceChannel.name}`,
    );
  },
};

export default join;

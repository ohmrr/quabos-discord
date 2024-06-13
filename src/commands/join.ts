import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import emojiMap from '../utils/emojiMap';
import Command from '../interfaces/command';

const join: Command = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join the voice channel.')
    .setDMPermission(false),
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;
    const guildMember = interaction.member as GuildMember;
    const voiceChannel = guildMember.voice.channel;

    if (!voiceChannel) {
      interaction.reply(`${emojiMap.error} You are not in a voice channel.`);
      return;
    }

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      selfDeaf: true,
      selfMute: false,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    interaction.reply(
      `${emojiMap.sound} Joined the voice channel ${voiceChannel.name}`,
    );
  },
};

export default join;

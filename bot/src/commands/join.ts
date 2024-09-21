import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import emojiMap from '../utils/emojiMap';
import Command from '../interfaces/command';

const join: Command = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join the voice channel.')
    .setDMPermission(false),
  usage: '/join',
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;
    const guildMember = interaction.member as GuildMember;
    const voiceChannel = guildMember.voice.channel;

    if (!voiceChannel) {
      interaction.reply(`${emojiMap.error.cross} You are not in a voice channel.`);
      return;
    }

    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      selfDeaf: false,
      selfMute: false,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    interaction.reply(
      `${emojiMap.sound.normal} Joined the voice channel ${voiceChannel.name}`,
    );
  },
};

export default join;

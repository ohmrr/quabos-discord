import { joinVoiceChannel } from '@discordjs/voice';
import { InteractionContextType, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import type Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join the voice channel.')
    .setContexts(InteractionContextType.Guild),
  usage: '/join',
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;
    const guildMember = interaction.guild.members.cache.get(interaction.user.id);
    const clientGuildMember = interaction.guild.members.me;
    const voiceChannel = guildMember?.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({
        content: `${emojiMap.error.cross} You are not in a voice channel.`,
        ephemeral: true,
      });
      return;
    }

    const clientPermissions = clientGuildMember?.permissionsIn(voiceChannel) || null;
    if (!clientPermissions || !clientPermissions.has(PermissionsBitField.Flags.Connect)) {
      await interaction.reply(
        `${emojiMap.error.cross} I do not the permission to join the voice channel.`,
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
} satisfies Command;

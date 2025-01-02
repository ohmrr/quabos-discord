import {
  ChannelType,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from 'discord.js';
import { prisma } from '../utils/client';
import type Command from '../interfaces/command';
import { FormatType, formatUnixTimestamp } from '../utils/date';

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information on the current guild.')
    .setContexts(InteractionContextType.Guild),
  usage: '/serverinfo',
  cooldown: 5_000,
  execute: async interaction => {
    if (!interaction.guild) return;

    const { guild } = interaction;
    const { id } = interaction.guild;
    const guildIcon = guild.iconURL({ size: 4096 }) || '';
    const guildRoles = guild.roles.cache
      .filter(role => role.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(role => `<@&${role.id}>`);

    const guildRecord = await prisma.guild.findUnique({
      where: { id },
      include: { trackedChannels: { include: { messages: true } } },
    });

    const serverInfoEmbed = new EmbedBuilder({
      author: {
        name: guild.name,
        iconURL: guildIcon,
      },
      thumbnail: { url: guildIcon },
      fields: [
        {
          name: 'Owner',
          value: `<@!${guild.ownerId}>`,
          inline: true,
        },
        {
          name: 'Server Created',
          value: formatUnixTimestamp(guild.createdAt, FormatType.FullDate),
          inline: true,
        },
        {
          name: 'Members',
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: 'Categories',
          value: `${guild.channels.cache.filter(channel => channel.type === ChannelType.GuildCategory).size}`,
          inline: true,
        },
        {
          name: 'Text Channels',
          value: `${guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size}`,
          inline: true,
        },
        {
          name: 'Voice Channels',
          value: `${guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size}`,
          inline: true,
        },
        {
          name: `Roles [${guildRoles.length}]`,
          value: guildRoles.join(' '),
          inline: false,
        },
      ],
      footer: {
        text: `ID: ${guild.id}`,
      },
      timestamp: Date.now(),
    });

    if (guildRecord && guildRecord.trackedChannels.length > 0) {
      const totalMessages = guildRecord.trackedChannels.reduce(
        (acc, channel) => acc + channel.messages.length,
        0,
      );

      serverInfoEmbed.addFields([
        {
          name: 'Tracked Channels',
          value: guildRecord.trackedChannels.map(channel => `<#${channel.id}>`).join(' '),
          inline: true,
        },
        { name: 'Messages Collected', value: `${totalMessages}`, inline: true },
      ]);
    }

    await interaction.reply({ embeds: [serverInfoEmbed] });
  },
} satisfies Command;

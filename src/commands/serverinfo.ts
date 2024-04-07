import { SlashCommandBuilder, EmbedBuilder, ChannelType } from 'discord.js';
import Command from '../interfaces/command';
import { prisma } from '..';
import moment from 'moment';

const serverInfo: Command = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get information on the current guild.')
    .setDMPermission(false),
  execute: async interaction => {
    if (!interaction.guild) return;

    const { guild } = interaction;
    const guildIcon = guild.iconURL({ size: 4096 }) || '';
    const guildRoles = guild.roles.cache
      .filter(role => role.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map(role => `<@&${role.id}>`);

    const guildRecord = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { watchChannels: { include: { messages: true } } },
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
          value: `${moment(guild.createdAt).format('MM/DD/YYYY h:mm A')}`,
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

    if (guildRecord) {
      const totalMessages = guildRecord.watchChannels.reduce(
        (acc, channel) => acc + channel.messages.length,
        0,
      );

      serverInfoEmbed.addFields([
        {
          name: 'Watch Channels',
          value: guildRecord.watchChannels
            .map(channel => `<#${channel.channelId}>`)
            .join(' '),
          inline: true,
        },
        { name: 'Messages Collected', value: `${totalMessages}`, inline: true },
      ]);
    }

    interaction.reply({ embeds: [serverInfoEmbed] });
  },
};

export default serverInfo;

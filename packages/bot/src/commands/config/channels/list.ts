import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../..';
import type Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('View the list of channels being read for messages.'),
  usage: '/config channels list',
  execute: async interaction => {
    if (!interaction.guild) return;

    const existingGuild = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { trackedChannels: true },
    });

    if (!existingGuild || existingGuild.trackedChannels.length === 0) {
      await interaction.reply({
        content: `${emojiMap.error.cross} There are no channels currently being read for messages.`,
        ephemeral: true,
      });

      return;
    }

    const channelList = existingGuild.trackedChannels
      .map(channel => `${emojiMap.celestial.star} <#${channel.channelId}>`)
      .join('\n');

    const listEmbed = new EmbedBuilder({
      author: {
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ size: 4096 }) || '',
      },
      title: 'Channels Being Tracked',
      description: channelList,
    });

    await interaction.reply({ embeds: [listEmbed] });
  },
} satisfies Subcommand;

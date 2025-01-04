import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../../utils/client';
import type Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('View the list of channels being read for messages.'),
  usage: '/config channels list',
  execute: async interaction => {
    if (!interaction.guild) return;

    const guildId = interaction.guild.id;

    const existingGuild = await prisma.guild.findUnique({
      where: { id: guildId },
      include: { trackedChannels: true },
    });

    if (!existingGuild || existingGuild.trackedChannels.length === 0) {
      await interaction.reply({
        content: `${emojiMap.error} There are no channels currently being read for messages.`,
        ephemeral: true,
      });

      return;
    }

    const channelList = existingGuild.trackedChannels
      .map(channel => `${emojiMap.star} <#${channel.id}>`)
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

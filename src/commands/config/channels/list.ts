import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../..';
import Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';

const list: Subcommand = {
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

    if (!existingGuild || !existingGuild.trackedChannels) {
      await interaction.reply(
        `${emojiMap.error.cross} There are no channels currently being read for messages.`,
      );

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
};

export default list;

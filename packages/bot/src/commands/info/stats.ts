import { SlashCommandSubcommandBuilder, EmbedBuilder } from 'discord.js';
import type Subcommand from '../../interfaces/subcommand';
import emojiMap from '../../utils/emojiMap';
import { prisma } from '../..';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('stats')
    .setDescription("Shows Quabos's stats for the current server."),
  usage: '/info stats',
  execute: async interaction => {
    if (!interaction.guild) return;

    const guildRecord = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { trackedChannels: { include: { messages: true } } },
    });

    if (!guildRecord) {
      await interaction.reply(`${emojiMap.error} There is no record stored for this guild.`);
      return;
    }

    const channelStatsList: string[] = [];
    if (guildRecord.trackedChannels.length > 0) {
      for (let i = 0; i < guildRecord.trackedChannels.length; i++) {
        const channel = interaction.guild.channels.cache.get(
          guildRecord.trackedChannels[i].channelId,
        );
        if (!channel) continue;

        const messageCount = guildRecord.trackedChannels[i].messages.length;
        channelStatsList[i] = `<#${channel.id}>: ${messageCount}`;
      }
    }

    const statsEmbed = new EmbedBuilder({
      author: {
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ size: 4096 }) || '',
      },
      title: `Quabos Stats in ${interaction.guild.name}`,
      description:
        `**Messages Count**:\n` +
        channelStatsList.map(text => `${emojiMap.star} ${text}`).join('\n'),
    });

    await interaction.reply({ embeds: [statsEmbed] });
  },
} satisfies Subcommand;

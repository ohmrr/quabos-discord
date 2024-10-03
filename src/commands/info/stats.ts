import {
  SlashCommandSubcommandBuilder,
  EmbedBuilder,
  APIEmbedField,
} from 'discord.js';
import Subcommand from '../../interfaces/subcommand';
import emojiMap from '../../utils/emojiMap';
import { prisma } from '../..';

const stats: Subcommand = {
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
      await interaction.reply(
        `${emojiMap.error.cross} There is no record stored for this guild.`,
      );
      return;
    }

    const channelFields: APIEmbedField[] = [];
    if (guildRecord.trackedChannels.length > 0) {
      for (let i = 0; i < guildRecord.trackedChannels.length; i++) {
        const channel = interaction.guild.channels.cache.get(
          guildRecord.trackedChannels[i].channelId,
        );
        if (!channel) continue;

        const messageCount = guildRecord.trackedChannels[i].messages.length;

        channelFields.push({
          name: 'Channel:',
          value: `<#${channel.id}> - Messages: ${messageCount}`,
          inline: true,
        });
      }
    }

    if (channelFields.length === 0) {
      await interaction.reply(
        `${emojiMap.error.cross} There are no watch channels or messages found.`,
      );
      return;
    }

    const statsEmbed = new EmbedBuilder({
      author: {
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ size: 4096 }) || '',
      },
      title: `Quabos Stats in ${interaction.guild.name}`,
      fields: channelFields,
    });

    await interaction.reply({ embeds: [statsEmbed] });
  },
};

export default stats;

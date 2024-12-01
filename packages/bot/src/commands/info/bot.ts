import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import type Subcommand from '../../interfaces/subcommand';
import { formatUnixTimestamp, FormatType } from '../../utils/date';
import safeReply from '../../utils/safeReply';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('bot')
    .setDescription('Shows information about Quabos.'),
  usage: '/info bot',
  execute: async interaction => {
    if (!interaction.guild) return;

    const botEmbed = new EmbedBuilder({
      title: 'Quabos Status',
      fields: [
        {
          name: 'Client Version',
          value: interaction.client.version,
          inline: true,
        },
        {
          name: 'Uptime',
          value: formatUnixTimestamp(interaction.client.readyAt, FormatType.Relative),
          inline: true,
        },
      ],
      thumbnail: { url: interaction.client.user.displayAvatarURL({ size: 4096 }) },
      timestamp: Date.now(),
    });

    await safeReply(interaction, { embeds: [botEmbed], ephemeral: true });
  },
} satisfies Subcommand;

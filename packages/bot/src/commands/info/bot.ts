import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { clientVersion } from '../..';
import Subcommand from '../../interfaces/subcommand';
import { formatUnixTimestamp, FormatType } from '../../utils/dateUtils';

const bot: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('bot')
    .setDescription('Shows information about Quabos.'),
  usage: '/info status',
  execute: async interaction => {
    if (!interaction.guild) return;

    const statusEmbed = new EmbedBuilder({
      title: 'Quabos Status',
      fields: [
        {
          name: 'Client Version',
          value: `v${clientVersion}`,
          inline: true,
        },
        {
          name: 'Uptime',
          value: formatUnixTimestamp(
            interaction.client.readyAt,
            FormatType.Relative,
          ),
          inline: true,
        },
      ],
      thumbnail: { url: interaction.client.user.displayAvatarURL({ size: 4096 }) },
      timestamp: Date.now(),
    });

    await interaction.reply({ embeds: [statusEmbed] });
  },
};

export default bot;

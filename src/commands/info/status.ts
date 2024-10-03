import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { clientVersion } from '../..';
import Subcommand from '../../interfaces/subcommand';
import { formatUnixTimestamp, FormatType } from '../../utils/timestamp';

const status: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('status')
    .setDescription('Shows information about Quabos.'),
  usage: '/status',
  execute: async interaction => {
    if (!interaction.guild) return;

    const statusEmbed = new EmbedBuilder({
      title: 'Quabos Status',
      fields: [
        {
          name: 'Uptime',
          value: formatUnixTimestamp(interaction.client.readyAt, FormatType.Relative),
        },
        {
          name: 'Version',
          value: `v${clientVersion}`,
        },
      ],
      timestamp: Date.now(),
    });

    await interaction.reply({ embeds: [statusEmbed] });
  },
};

export default status;

import { EmbedBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../..';
import Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';

const view: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('view')
    .setDescription(
      'View the probability of Quabos randomly responding to messages sent in the server.',
    ),
  usage: '/config probability view',
  execute: async interaction => {
    if (!interaction.guild) return;

    const guildRecord = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      select: { probability: true },
    });

    const notTrackedEmbed = new EmbedBuilder().setDescription(
      `${emojiMap.error.cross} This guild is not currently being tracked.`,
    );

    if (!guildRecord) {
      await interaction.reply({ embeds: [notTrackedEmbed], ephemeral: true });
      return;
    }

    const probabilityEmbed = new EmbedBuilder().setDescription(
      `The server's current probability is set to **${guildRecord.probability * 100}%**.`,
    );

    await interaction.reply({ embeds: [probabilityEmbed], ephemeral: true });
  },
};

export default view;

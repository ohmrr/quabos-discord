import { EmbedBuilder, PermissionsBitField, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../..';
import type Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';
import logger from '../../../utils/logger';

const set: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('set')
    .setDescription(
      'Change the probability that Quabos will respond to a message sent in your server.',
    )
    .addNumberOption(option =>
      option
        .setName('probability')
        .setDescription('The percent probability that Quabos will respond.')
        .setMaxValue(100)
        .setMinValue(0),
    ),
  permissions: new PermissionsBitField(PermissionsBitField.Flags.ManageGuild),
  usage: '/config probability set [amount]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const newProbabilityValue = interaction.options.getNumber('probability', true);
    const guildRecord = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      select: { probability: true },
    });

    if (!guildRecord) {
      await interaction.reply({
        content: `${emojiMap.error.cross} This guild is not currently being tracked.`,
        ephemeral: true,
      });
      return;
    }

    if (guildRecord.probability * 100 === newProbabilityValue) {
      await interaction.reply({
        content: `${emojiMap.error.cross} The probability for your server is already set to **${newProbabilityValue}%**.`,
        ephemeral: true,
      });
      return;
    }

    const probabilityUpdateEmbed = new EmbedBuilder().setDescription(
      `${emojiMap.success.check} The server's probability has successfully been set to **${newProbabilityValue}%**.`,
    );

    try {
      await prisma.guild.update({
        where: { guildId: interaction.guild.id },
        data: { probability: newProbabilityValue / 100 },
      });

      await interaction.reply({ embeds: [probabilityUpdateEmbed] });
    } catch (error) {
      logger.error(
        { guildId: interaction.guild.id, newProbabilityValue, error },
        'Error updating the guild probability.',
      );
      await interaction.reply({
        content: `${emojiMap.error.cross} There was an error updating the probability. Please try again.`,
        ephemeral: true,
      });
    }
  },
};

export default set;

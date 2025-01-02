import { PermissionsBitField, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../../utils/client';
import Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';
import logger from '../../../utils/logger';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('timeset')
    .setDescription(
      'Set the amount of time needed for the inactivity trigger.',
    )
    .addIntegerOption(time =>
      time
        .setName('time')
        .setDescription('How much time in minutes you want the inactivity threshold to be.')
        .setMinValue(60)
        .setMaxValue(360)
        .setRequired(true),
    ),
  permissions: new PermissionsBitField(PermissionsBitField.Flags.ManageGuild),
  usage: '/config inactivity timeset [minutes]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const guildId = interaction.guild.id;
    const newThresholdAmountMinutes = interaction.options.getInteger('time', true);

    try {
      const guildRecord = await prisma.guild.findUnique({ where: { id: guildId } });

      if (!guildRecord) {
        await interaction.reply({
          content: `${emojiMap.error} This guild does not have any channels being tracked for messages. Please add a tracked channel through /config channels add [channel] in order for Quabos to generate new messages.`,
          ephemeral: true,
        });
        return;
      }

      if (guildRecord.inactivityThreshold === newThresholdAmountMinutes) {
        await interaction.reply({
          content: `${emojiMap.error} The current inactivity threshold is already set to ${newThresholdAmountMinutes} minutes.`,
          ephemeral: true,
        });
        return;
      }

      await prisma.guild.update({
        where: { id: guildId },
        data: { inactivityThreshold: newThresholdAmountMinutes },
      });
      await interaction.reply(
        `${emojiMap.success} Successfully updated the inactivity threshold to ${newThresholdAmountMinutes} minutes.`,
      );
    } catch (error) {
      logger.error(error, 'Error setting guild inactivity threshold.');
      interaction.reply({
        content: `${emojiMap.error} There was an error setting the inactivity threshold. Please try again later.`,
        ephemeral: true,
      });
    }
  },
} satisfies Subcommand;

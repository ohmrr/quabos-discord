import { PermissionsBitField, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../..';
import Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';
import logger from '../../../utils/logger';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('triggerEnabled')
    .setDescription(
      'Set the inactivity trigger on or off. This will make it so that after a certain amount of time where no messages have been sent, Quabos will try to start up a conversation.',
    )
    .addBooleanOption(state =>
      state
        .setName('state')
        .setDescription('Whether you want the inactivity trigger to be on or off.')
        .setRequired(true),
    ),
  permissions: new PermissionsBitField(PermissionsBitField.Flags.ManageGuild),
  usage: '/config inactitivity triggerEnabled [state]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const guildId = interaction.guild.id;
    const state = interaction.options.getBoolean('state', true);

    try {
      const guildRecord = await prisma.guild.findUnique({ where: { id: guildId } });

      if (!guildRecord) {
        await interaction.reply({
          content: `${emojiMap.error} This guild does not have any channels being tracked for messages. Please add a tracked channel through /config channels add [channel] in order for Quabos to generate new messages.`,
          ephemeral: true,
        });
        return;
      }

      if (guildRecord.inactivityTrigger === state) {
        await interaction.reply({
          content: `${emojiMap.error} Inactivity trigger is already ${state === true ? 'enabled' : 'disabled '} for this guild. If you meant to turn it ${state === true ? 'off' : 'on'}, run the command again with the option set to **${!state}**.`,
          ephemeral: true,
        });
        return;
      }

      const { inactivityThreshold } = guildRecord;
      const defaultThresholdMinutes = 120;
      const thresholdAmountMinutes = inactivityThreshold ? inactivityThreshold : defaultThresholdMinutes;

      await prisma.guild.update({
        where: { id: guildId },
        data: { inactivityTrigger: { set: state }, inactivityThreshold: { set: thresholdAmountMinutes } },
      });

      if (state) {
        await interaction.reply(`${emojiMap.success} The inactivity trigger was successfully enabled. The current inactivity threshold in minutes is set to ${thresholdAmountMinutes}.`);
        return;
      }

      await interaction.reply(`${emojiMap.success} The inactivity trigger was successfully disabled.`);
    } catch (error) {
      logger.error(error, "Error setting guild inactivity trigger.");
      interaction.reply({ content: `${emojiMap.error} There was an error setting the guild inactivity trigger. Please try again later.`, ephemeral: true })
    }
  },
} satisfies Subcommand;

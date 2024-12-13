import { SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../..';
import type Subcommand from '../../interfaces/subcommand';
import emojiMap from '../../utils/emojiMap';
import logger from '../../utils/logger';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('opt-in')
    .setDescription('Opt-in to message collection for the model.')
    .addStringOption(scope =>
      scope
        .setName('scope')
        .setDescription(
          'Opt-in either only in this server, or globally (in every server that both you and Quabos are in).',
        )
        .addChoices({ name: 'server', value: 'server' }, { name: 'global', value: 'global' })
        .setRequired(true),
    ),
  usage: '/privacy opt-in [scope]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const scope = interaction.options.getString('scope', true);
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (scope === 'global') {
      if (!user || !user.globalIgnored) {
        await interaction.reply({
          content: `You are already opted-in globally!`,
          ephemeral: true,
        });
        return;
      }

      try {
        await prisma.user.update({ where: { id: userId }, data: { globalIgnored: true } });
        await interaction.reply({
          content: `${emojiMap.success} You have successfully opted-in globally!`,
          ephemeral: true,
        });
      } catch (error) {
        logger.error(error, 'There was an error opting a user in globally.')
        await interaction.reply({
          content: `${emojiMap.error} There was an error opting you in globally. Please try again later or report this error to the developers.`,
          ephemeral: true,
        });
      }

      return;
    }

    if (!user || !user.guildIgnoredIds.includes(guildId)) {
      await interaction.reply({ content: `You are already opted-in for this server.`, ephemeral: true });
      return;
    }

    try {
      const updatedGuildList = user.guildIgnoredIds.filter((id) => id !== guildId);
      await prisma.user.update({ where: { id: userId }, data: { guildIgnoredIds: updatedGuildList }})
    } catch (error) {
      logger.error(error, 'There was an error opting a user out in a server.')
      await interaction.reply({
        content: `${emojiMap.error} There was an error opting you in this server. Please try again later or report this error to the developers.`,
        ephemeral: true,
      });
    }
  },
} satisfies Subcommand;

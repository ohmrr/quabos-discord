import { SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../..';
import type Subcommand from '../../interfaces/subcommand';
import emojiMap from '../../utils/emojiMap';
import logger from '../../utils/logger';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('opt-out')
    .setDescription('Opt-out of message collection for the model.')
    .addStringOption(scope =>
      scope
        .setName('scope')
        .setDescription(
          'Opt-out either only in this server, or globally (in every server that both you and Quabos are in).',
        )
        .addChoices({ name: 'server', value: 'server' }, { name: 'global', value: 'global' })
        .setRequired(true),
    ),
  usage: '/privacy opt-out [scope]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const scope = interaction.options.getString('scope', true);
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (scope === 'global') {
      if (!user || !user.globalIgnored) {
        try {
          await prisma.user.upsert({ where: { id: guildId }, update: { globalIgnored: true }, create: { id: userId, globalIgnored: true } });
          await interaction.reply({ content: `${emojiMap.success} You have successfully opted-out globally.`, ephemeral: true })
        } catch (error) {
          logger.error(error, 'There was an error opting a user out globally. Please try again later or report this error to the developers.');
          await interaction.reply({ content: `${emojiMap.error} There was an error opting you out globally. Please try again later or report this error to the developers.`, ephemeral: true })
        }

        return;
      }

      await interaction.reply({ content: `${emojiMap.error} You have already opted-out globally!`, ephemeral: true })
      return;
    }

    if (user) {
      if (user.guildIgnoredIds.includes(guildId)) {
        await interaction.reply({ content: `${emojiMap.error} You have already opted-out for this server.`, ephemeral: true });
        return;
      }

      try {
        const updatedGuildList = [...user.guildIgnoredIds, guildId];
        await prisma.user.upsert({ where: { id: userId }, update: { guildIgnoredIds: updatedGuildList }, create: { id: userId, guildIgnoredIds: updatedGuildList } });
      } catch (error) {
        logger.error(error, 'There was an error opting a user out for a server.')
        await interaction.reply({
          content: `${emojiMap.error} There was an error opting you out for this server. Please try again later or report this error to the developers.`,
          ephemeral: true,
        });
      }
    }

  },
} satisfies Subcommand;

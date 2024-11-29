import { SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../..';
import type Subcommand from '../../interfaces/subcommand';
import emojiMap from '../../utils/emojiMap';

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

    if (scope === 'global') {
      const user = await prisma.user.findUnique({
        where: { userId },
      });

      if (!user) {
        await interaction.reply({
          content: `${emojiMap.success} You are already opted-in globally!`,
          ephemeral: true,
        });
        return;
      }

      if (user.ignored) {
        await prisma.user.update({
          where: { userId },
          data: { ignored: false },
        });
        await interaction.reply({
          content: `${emojiMap.success} You have successfully opted-in globally!`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `${emojiMap.error} You are already opted-in globally!`,
          ephemeral: true,
        });
      }
      return;
    }

    if (scope === 'server') {
      const guildMember = await prisma.guildMember.findUnique({
        where: { userId_guildId: { userId, guildId } },
      });

      if (!guildMember) {
        await interaction.reply({
          content: `${emojiMap.success} You are already opted-in for this server!`,
          ephemeral: true,
        });
        return;
      }

      if (guildMember.ignored) {
        await prisma.guildMember.update({
          where: { userId_guildId: { userId, guildId } },
          data: { ignored: false },
        });
        await interaction.reply({
          content: `${emojiMap.success} You have successfully opted-in for this server!`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `${emojiMap.error} You are already opted-in for this server!`,
          ephemeral: true,
        });
      }
    }
  },
} satisfies Subcommand;

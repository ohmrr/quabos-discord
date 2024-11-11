import { SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../..';
import type Subcommand from '../../interfaces/subcommand';
import emojiMap from '../../utils/emojiMap';

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

    if (scope === 'global') {
      const user = await prisma.user.findUnique({
        where: { userId },
      });

      if (!user || !user.ignored) {
        await prisma.user.upsert({
          where: { userId },
          update: { ignored: true },
          create: { userId, ignored: true },
        });

        await interaction.reply({
          content: `${emojiMap.success.check} You have successfully opted-out globally!`,
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `${emojiMap.error.cross} You have already opted-out globally!`,
        ephemeral: true,
      });
      return;
    }

    if (scope === 'server') {
      const guildMember = await prisma.guildMember.findUnique({
        where: { userId_guildId: { userId, guildId } },
      });

      if (!guildMember || !guildMember.ignored) {
        await prisma.guildMember.upsert({
          where: { userId_guildId: { userId, guildId } },
          update: { ignored: true },
          create: { userId, guildId, ignored: true },
        });

        await interaction.reply({
          content: `${emojiMap.success.check} You have successfully opted-out for this server!`,
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `${emojiMap.error.cross} You have already opted-out for this server!`,
        ephemeral: true,
      });
    }
  },
} satisfies Subcommand;

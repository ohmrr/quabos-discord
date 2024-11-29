import { ChannelType, PermissionsBitField, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../..';
import type Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';
import logger from '../../../utils/logger';

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Removes a channel that Quabos reads messages from.')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to remove.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    ),
  permissions: new PermissionsBitField(PermissionsBitField.Flags.ManageGuild),
  usage: '/config channels remove [channel]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const selectedChannel = interaction.options.getChannel('channel', true);
    const existingGuild = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { trackedChannels: true },
    });

    if (
      !existingGuild ||
      !existingGuild.trackedChannels.some(channel => channel.channelId === selectedChannel.id)
    ) {
      await interaction.reply(
        `${emojiMap.error} Channel <#${selectedChannel.id}> is not being read for new messages.`,
      );
      return;
    }

    try {
      await prisma.channel.delete({ where: { channelId: selectedChannel.id } });
      await interaction.reply(
        `${emojiMap.success} Channel <#${selectedChannel.id}> is no longer being read for new messages.`,
      );
    } catch (error) {
      logger.error(
        { guildId: interaction.guild.id, channelId: selectedChannel.id, error },
        'Error while deleting channel record',
      );
      await interaction.reply(
        `${emojiMap.error} An error occurred while removing the channel.`,
      );
    }
  },
} satisfies Subcommand;

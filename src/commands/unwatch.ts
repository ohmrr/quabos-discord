import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';
import { prisma } from '..';

const unwatch: Command = {
  data: new SlashCommandBuilder()
    .setName('unwatch')
    .setDescription('Select a channel to stop watching for new messages.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to stop watching.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    )
    .setDMPermission(false),
  execute: async interaction => {
    if (!interaction.guild) return;

    const selectedChannel = interaction.options.getChannel('channel', true);
    const existingGuild = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { watchChannels: true },
    });

    if (
      !existingGuild ||
      !existingGuild.watchChannels.some(
        channel => channel.channelId === selectedChannel.id,
      )
    ) {
      interaction.reply(
        `${emojiMap.error} Channel <#${selectedChannel.id}> is not being watched.`,
      );
      return;
    }

    try {
      await prisma.channel.delete({ where: { channelId: selectedChannel.id } });
      interaction.reply(
        `${emojiMap.success} Channel <#${selectedChannel.id}> is no longer being watched for new messages.`,
      );
    } catch (error) {
      console.error('Error while deleting channel record: ', error);
      interaction.reply(
        `${emojiMap.error} An error occurred while removing the channel from the watch list.`,
      );
    }
  },
};

export default unwatch;

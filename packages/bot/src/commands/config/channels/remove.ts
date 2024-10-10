import { ChannelType, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../..';
import Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';

const remove: Subcommand = {
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
      !existingGuild.trackedChannels.some(
        channel => channel.channelId === selectedChannel.id,
      )
    ) {
      await interaction.reply(
        `${emojiMap.error.cross} Channel <#${selectedChannel.id}> is not being read for new messages.`,
      );
      return;
    }

    try {
      await prisma.channel.delete({ where: { channelId: selectedChannel.id } });
      await interaction.reply(
        `${emojiMap.success.check} Channel <#${selectedChannel.id}> is no longer being read for new messages.`,
      );
    } catch (error) {
      console.error('Error while deleting channel record: ', error);
      await interaction.reply(
        `${emojiMap.error.cross} An error occurred while removing the channel.`,
      );
    }
  },
};

export default remove;

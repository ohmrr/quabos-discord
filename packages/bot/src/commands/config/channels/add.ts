import { ChannelType, SlashCommandSubcommandBuilder, PermissionsBitField } from 'discord.js';
import { prisma } from '../../..';
import Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';
import { checkAndUpdateGuildRecord } from '../../../utils/guildUtils';

const add: Subcommand = {
  data: new SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Adds a new channel for reading messages.')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to read for messages.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    ),
  usage: '/config channels add [channel]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const selectedChannel = interaction.options.getChannel('channel', true);

    if (selectedChannel.type !== ChannelType.GuildText) {
      await interaction.reply(
        `${emojiMap.error.cross} The selected channel is not a text channel.`,
      );
      return;
    }

    if (!selectedChannel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ViewChannel)) {
      await interaction.reply(
        `${emojiMap.error.cross} I do not have permission to read messages in the selected channel.`,
      );
      return;
    }

    const existingGuild = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { trackedChannels: true },
    });

    const isAlreadyTracked = existingGuild?.trackedChannels.some(
      channel => channel.channelId === selectedChannel.id,
    );

    if (isAlreadyTracked) {
      await interaction.reply(
        `${emojiMap.error.cross} Channel <#${selectedChannel.id}> is already being read for new messages.`,
      );
      return;
    }

    try {
      await checkAndUpdateGuildRecord(interaction.guild.id, interaction.guild.name, selectedChannel.id);
      await interaction.reply(
        `${emojiMap.success.check} Channel <#${selectedChannel.id}> is now being read for new messages.`,
      );
    } catch (error) {
      console.error(
        `Error while creating guild record. Guild Name: ${interaction.guild.name} ID: ${interaction.guild.id}: ${error}`,
      );
      await interaction.reply(
        `${emojiMap.error.cross} An error occurred while creating the guild record. Please try again later.`,
      );
    }
  },
};

export default add;

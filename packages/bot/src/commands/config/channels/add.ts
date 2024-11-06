import {
  ChannelType,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
  TextChannel,
} from 'discord.js';
import { prisma } from '../../..';
import type Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';
import logger from '../../../utils/logger';

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
  permissions: new PermissionsBitField(PermissionsBitField.Flags.ManageGuild),
  usage: '/config channels add [channel]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const selectedChannel = interaction.options.getChannel('channel', true);
    if (!(selectedChannel instanceof TextChannel)) {
      await interaction.reply({
        content: `${emojiMap.error.cross} The selected channel is not a text channel.`,
        ephemeral: true,
      });
      return;
    }

    const clientGuildMember = interaction.guild.members.me;
    const clientPermissions = clientGuildMember?.permissionsIn(selectedChannel) || null;
    if (!clientPermissions || !clientPermissions.has(PermissionsBitField.Flags.ViewChannel)) {
      await interaction.reply(
        `${emojiMap.error.cross} I don't have permission to read messages in the selected channel.`,
      );
      return;
    }

    const existingGuild = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { trackedChannels: true },
    });

    if (existingGuild) {
      const isAlreadyTracked = existingGuild.trackedChannels.some(
        channel => channel.channelId === selectedChannel.id,
      );

      if (isAlreadyTracked) {
        await interaction.reply({
          content: `${emojiMap.error.cross} Channel <#${selectedChannel.id}> is already being read for new messages.`,
          ephemeral: true,
        });
        return;
      }

      try {
        await prisma.guild.update({
          where: { guildId: interaction.guild.id },
          data: {
            trackedChannels: {
              create: {
                channelId: selectedChannel.id,
              },
            },
          },
        });

        await interaction.reply(
          `${emojiMap.success.check} Channel <#${selectedChannel.id}> is now being read for new messages.`,
        );
        return;
      } catch (error) {
        logger.error(
          { guildId: interaction.guild.id, name: interaction.guild.name, error }, 'Error updating guild record.',
        );
        await interaction.reply({
          content: `${emojiMap.error.cross} An error occurred while updating the channel record.`,
          ephemeral: true,
        });
      }
    }

    try {
      await prisma.guild.create({
        data: {
          guildId: interaction.guild.id,
          name: interaction.guild.name,
          trackedChannels: {
            create: {
              channelId: selectedChannel.id,
            },
          },
        },
      });

      await interaction.reply(
        `${emojiMap.success.check} Channel <#${selectedChannel.id}> is now being read for new messages.`,
      );
    } catch (error) {
      logger.error(
        { guildId: interaction.guild.id, name: interaction.guild.id, error }, 'Error creating guild record.',
      );
      await interaction.reply({
        content: `${emojiMap.error.cross} An error occurred while creating the guild record. Please try again later.`,
        ephemeral: true,
      });
    }
  },
};

export default add;

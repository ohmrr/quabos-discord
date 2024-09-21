import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';
import { prisma } from '..';

const watch: Command = {
  data: new SlashCommandBuilder()
    .setName('watch')
    .setDescription('Select a new channel for the model to gather messages from.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to watch for messages.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    )
    .setDMPermission(false),
  usage: '/watch [channel]',
  execute: async interaction => {
    if (!interaction.guild) return;

    const selectedChannel = interaction.options.getChannel('channel', true);
    const existingGuild = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { watchChannels: true },
    });

    if (existingGuild) {
      const isAlreadyWatched = existingGuild.watchChannels.some(
        channel => channel.channelId === selectedChannel.id,
      );

      if (isAlreadyWatched) {
        interaction.reply(
          `${emojiMap.error} Channel <#${selectedChannel.id}> is already being watched for new messages.`,
        );
        return;
      }

      try {
        await prisma.guild.update({
          where: { guildId: interaction.guild.id },
          data: {
            watchChannels: {
              create: {
                channelId: selectedChannel.id,
              },
            },
          },
        });

        interaction.reply(
          `${emojiMap.success} Channel <#${selectedChannel.id}> is now being watched for new messages.`,
        );
        return;
      } catch (error) {
        console.error(
          `Error while creating guild record. Guild Name: ${interaction.guild.name} ID: ${interaction.guild.id}: ${error}`,
        );
        interaction.reply(
          `${emojiMap.error} An error occurred while creating the channel record.`,
        );
      }
    }

    try {
      await prisma.guild.create({
        data: {
          guildId: interaction.guild.id,
          name: interaction.guild.name,
          watchChannels: {
            create: {
              channelId: selectedChannel.id,
            },
          },
        },
      });

      interaction.reply(
        `${emojiMap.success} Channel <#${selectedChannel.id}> is now being watched for new messages.`,
      );
    } catch (error) {
      console.error(
        `Error while creating guild record. Guild Name: ${interaction.guild.name} ID: ${interaction.guild.id}: ${error}`,
      );
      interaction.reply(
        `${emojiMap.error} An error occurred while creating the guild record. Please try again later.`,
      );
    }
  },
};

export default watch;

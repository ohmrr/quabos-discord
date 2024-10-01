import { ChannelType, SlashCommandSubcommandBuilder } from 'discord.js';
import { prisma } from '../../..';
import Subcommand from '../../../interfaces/subcommand';
import emojiMap from '../../../utils/emojiMap';

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
  usage: '/config add [channel]',
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
        await interaction.reply(
          `${emojiMap.error.cross} Channel <#${selectedChannel.id}> is already being read for new messages.`,
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

        await interaction.reply(
          `${emojiMap.success.check} Channel <#${selectedChannel.id}> is now being read for new messages.`,
        );
        return;
      } catch (error) {
        console.error(
          `Error while creating guild record. Guild Name: ${interaction.guild.name} ID: ${interaction.guild.id}: ${error}`,
        );
        await interaction.reply(
          `${emojiMap.error.cross} An error occurred while creating the channel record.`,
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

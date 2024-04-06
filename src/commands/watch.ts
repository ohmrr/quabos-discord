import { ChannelType, SlashCommandBuilder } from 'discord.js';
import Command from '../interfaces/command';
import { prisma } from '..';

const listen: Command = {
  data: new SlashCommandBuilder()
    .setName('watch')
    .setDescription('Select a new channel for the model to gather messages from.')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to watch for messages.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    ),
  execute: async interaction => {
    if (!interaction.guild) return;

    const selectedChannel = interaction.options.getChannel('channel', true);
    const existingGuild = await prisma.guild.findUnique({
      where: { guildId: interaction.guild.id },
      include: { watchChannels: true },
    });

    if (existingGuild) {
      const isAlreadyWatched = existingGuild.watchChannels.some(
        channel => channel.id === selectedChannel.id,
      );

      if (isAlreadyWatched) {
        interaction.reply(
          `Channel ${selectedChannel.name} is already being watched for new messages.`,
        );
      }

      await prisma.guild.upsert({
        where: { guildId: interaction.guild.id },
        update: {},
        create: {
          guildId: interaction.guild.id,
          watchChannels: {
            create: {
              channelId: selectedChannel.id,
            },
          },
        },
      });

      interaction.reply(
        `Channel ${selectedChannel.name} is now being watched for new messages.`,
      );
    }
  },
};

export default listen;

import { ChannelType, SlashCommandBuilder } from 'discord.js';
import Command from '../interfaces/command';
import { prisma } from '..';

const listen: Command = {
  data: new SlashCommandBuilder()
    .setName('listen')
    .setDescription('Select a new channel for the model to gather messages from.')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to listen for messages.')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    ),
  execute: async interaction => {
    if (!interaction.guild) return;

    const listenChannel = interaction.options.getChannel('channel', true);
    prisma.guild.create({
      data: {
        guildId: interaction.guild.id,
        watchChannels: {
          create: {
            channelId: listenChannel.id,
          },
        },
      },
    });
  },
};

export default listen;

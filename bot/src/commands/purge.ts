import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const purge: Command = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages in the current channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addIntegerOption(amount =>
      amount
        .setName('amount')
        .setDescription('Number of messages you want to delete.')
        .setMaxValue(100)
        .setMinValue(1)
        .setRequired(true),
    ),
  usage: '/purge [count]',
  execute: async interaction => {
    if (!interaction.guild || !interaction.channel) return;
    if (!interaction.channel.isTextBased()) return;

    const amount = interaction.options.getInteger('amount', true);
    const channel = interaction.channel;

    if (channel instanceof TextChannel) {
      try {
        const allMessages = await channel.messages.fetch({ limit: amount });
        if (!allMessages) {
          interaction.reply(`${emojiMap.error} No messages found.`);
          return;
        }

        const fourteenDaysMilli = 60 * 60 * 24 * 14 * 1000;
        const currentTime = Date.now();

        const messages = allMessages.filter(
          msg => currentTime - msg.createdTimestamp < fourteenDaysMilli,
        );
        if (messages.size === 0) {
          interaction.reply(
            `${emojiMap.error} Messages cannot be deleted after 14 days.`,
          );
          return;
        }

        channel.bulkDelete(messages);
        interaction.reply(`${emojiMap.success} Deleted ${messages.size} messages.`);
      } catch (error) {
        console.error('Failed to purge messages.');
        interaction.reply(`${emojiMap.error} Failed to purge the messages.`);
      }
    }
  },
};

export default purge;

import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const clean: Command = {
  data: new SlashCommandBuilder()
    .setName('clean')
    .setDescription('Clean the current channel of any bot messages.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  usage: '/clean [count]',
  execute: async interaction => {
    if (!interaction.guild || !interaction.channel) return;
    if (!interaction.channel.isTextBased()) return;
    const channel = interaction.channel;

    if (channel instanceof TextChannel) {
      try {
        if (!interaction.guild || !interaction.channel) return;
        if (!interaction.channel.isTextBased()) return;

        const currentTime = Date.now();
        const fourteenDaysMilli = 60 * 60 * 24 * 14 * 1000;
        const allMessages = await channel.messages.fetch({ limit: 100 });

        const messages = allMessages.filter(
          message =>
            message.author.bot &&
            currentTime - message.createdTimestamp < fourteenDaysMilli,
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
        console.error('Failed to clean channel of bot messages.');
        interaction.reply(
          `${emojiMap.error} Failed to clean the channel of bot messages.`,
        );
      }
    }
  },
};

export default clean;

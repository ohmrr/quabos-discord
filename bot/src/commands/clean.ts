import {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const clean: Command = {
  data: new SlashCommandBuilder()
    .setName('clean')
    .setDescription("Clean the current channel of any of the bot's messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts(InteractionContextType.Guild),
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
            message.author.id === interaction.client.user.id &&
            currentTime - message.createdTimestamp < fourteenDaysMilli,
        );

        if (messages.size === 0) {
          await interaction.reply(
            `${emojiMap.error} Messages cannot be deleted after 14 days.`,
          );
          return;
        }

        channel.bulkDelete(messages);
        await interaction.reply(
          `${emojiMap.success.check} Deleted ${messages.size} messages.`,
        );
      } catch (error) {
        console.error('Failed to clean channel of bot messages.');
        await interaction.reply(
          `${emojiMap.error.denied} Failed to clean the channel of bot messages.`,
        );
      }
    }
  },
};

export default clean;

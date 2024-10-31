import {
  InteractionContextType,
  PermissionsBitField,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const purge: Command = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete messages in the current channel.')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)
    .setContexts(InteractionContextType.Guild)
    .addIntegerOption(amount =>
      amount
        .setName('amount')
        .setDescription('Number of messages you want to delete.')
        .setMaxValue(100)
        .setMinValue(1)
        .setRequired(true),
    ),
  permissions: new PermissionsBitField(PermissionsBitField.Flags.ManageMessages),
  usage: '/purge [amount]',
  execute: async interaction => {
    if (!interaction.guild || !interaction.channel) return;
    if (!interaction.channel.isTextBased()) return;

    const amount = interaction.options.getInteger('amount', true);
    const channel = interaction.channel;

    if (channel instanceof TextChannel) {
      try {
        const allMessages = await channel.messages.fetch({ limit: amount });
        if (!allMessages) {
          await interaction.reply(`${emojiMap.error.cross} No messages found.`);
          return;
        }

        const fourteenDaysMilli = 60 * 60 * 24 * 14 * 1000;
        const currentTime = Date.now();

        const messages = allMessages.filter(
          msg => currentTime - msg.createdTimestamp < fourteenDaysMilli,
        );
        if (messages.size === 0) {
          await interaction.reply({
            content: `${emojiMap.error.denied} Messages cannot be deleted after 14 days.`,
            ephemeral: true,
          });
          return;
        }

        channel.bulkDelete(messages);
        await interaction.reply(
          `${emojiMap.success.check} Deleted ${messages.size} messages.`,
        );
      } catch (error) {
        console.error('Failed to purge messages.');
        await interaction.reply({
          content: `${emojiMap.error.denied} Failed to purge the messages.`,
          ephemeral: true,
        });
      }
    }
  },
};

export default purge;

import { SlashCommandBuilder, TextChannel } from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const clean: Command = {
  data: new SlashCommandBuilder()
    .setName('clean')
    .setDescription('Clean the channel of bot messages.')
    .setDMPermission(false),
  execute: async interaction => {
    if (
      !interaction.guild ||
      !interaction.channel ||
      !interaction.channel.isTextBased()
    )
      return;
    const channel = interaction.channel;

    if (channel instanceof TextChannel) {
      try {
        const messages = await channel.messages.fetch({ limit: 100 });
        const botMessages = messages.filter(message => message.author.bot);

        await channel.bulkDelete(botMessages);
        interaction.reply(
          `${emojiMap.success} Deleted ${botMessages.size} messages.`,
        );
      } catch {
        console.error('Failed to delete messages.');
        interaction.reply(`${emojiMap.error} Failed to delete the messages.`);
      }
    }
  },
};

export default clean;

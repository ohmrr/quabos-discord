import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const clean: Command = {
  data: new SlashCommandBuilder()
    .setName('clean')
    .setDescription('Clean the current channel of any bot messages.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  execute: async interaction => {
    if (!interaction.guild || !interaction.channel) return;
    if (!interaction.channel.isTextBased()) return;
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
        console.error('Failed to delete bot messages.');
        interaction.reply(`${emojiMap.error} Failed to delete the messages.`);
      }
    }
  },
};

export default clean;

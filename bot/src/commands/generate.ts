import { SlashCommandBuilder } from 'discord.js';
import { generateResponse } from '../utils/markov/markovUtils';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const generate: Command = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Force a new message to be generated.')
    .setDMPermission(false),
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;

    const guildId = interaction.guild.id;
    const response = await generateResponse(guildId);

    if (!response) {
      interaction.reply(
        `${emojiMap.error} Message cannot be generated. Quabos must gather more messages in the specified watch channel.`,
      );
    } else {
      interaction.reply(`${emojiMap.alien} ${response}`);
    }
  },
};

export default generate;

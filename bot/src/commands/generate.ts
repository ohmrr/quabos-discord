import { SlashCommandBuilder } from 'discord.js';
import { generateResponse } from '../utils/markov/markovUtils';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

const generate: Command = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Force a new message to be generated.')
    .setDMPermission(false),
  usage: '/generate',
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;

    await interaction.deferReply();

    const guildId = interaction.guild.id;
    const response = await generateResponse(guildId);

    const emojiList = Array.from(Object.values(emojiMap.celestial));
    const randomIndex = Math.floor(Math.random() * emojiList.length);

    if (!response) {
      await interaction.editReply(
        `${emojiMap.error} I need to gather more messages. Try setting a watch channel with /watch then check how many messages are collected with /serverinfo.`,
      );
    } else {
      await interaction.editReply(`${emojiList[randomIndex]} ${response}`);
    }
  },
};

export default generate;

import { InteractionContextType, SlashCommandBuilder } from 'discord.js';
import { generateResponse } from '../utils/markov';
import Command from '../interfaces/command';
import emojiMap from '../utils/emojiMap';

export default {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Force a new message to be generated.')
    .setContexts(InteractionContextType.Guild),
  usage: '/generate',
  cooldown: 5_000,
  execute: async interaction => {
    if (!interaction.guild || !interaction.member) return;

    await interaction.deferReply();

    const guildId = interaction.guild.id;
    const response = await generateResponse(guildId);

    // const spaceEmojiNames = ['alien', 'planet', 'moon', 'galaxy', 'comet', 'rocket', 'ufo', 'star'];
    // const spaceEmojiList: string[];

    if (!response) {
      await interaction.editReply(
        'I was unable to generate a message. Make sure at least one channel is set to be tracked with `/config channels add [channel]` and try again later!',
      );
    } else {
      await interaction.editReply(`${response}`);
    }
  },
} satisfies Command;

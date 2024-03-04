import {
  ChatInputCommandInteraction,
  CommandInteraction,
  Interaction,
  SlashCommandBuilder,
} from 'discord.js';
import Command from '../interfaces/command';

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows the client ping'),
  execute: async (interaction) => {
    await interaction.reply(`${interaction.client.ws.ping} ms`);
  },
};

export default ping;

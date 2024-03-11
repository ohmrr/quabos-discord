import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export default Command;

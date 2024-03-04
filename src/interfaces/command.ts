import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => void;
}

export default Command;

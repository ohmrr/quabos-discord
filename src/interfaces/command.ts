import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

interface Command {
  data:
    | SlashCommandBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: ChatInputCommandInteraction) => void;
}

export default Command;
